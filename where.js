function Where($where = {}, $addWhere = false){

  this.setAddWhere($addWhere);

  this.where = {};

  this.result = [];

  this.AND = null;

  this.OR = null;

  this.logic = 'AND';

  $where && Object.prototype.toString.call($where) === '[object Object]' && (this.where = $where);

  for ($x in this.where){
    if ($x === '$and'){
      this.AND = new Where(this.where[$x]);
    }
    else if ($x === '$or'){
      this.OR = new Where(this.where[$x]);
      this.OR.logic = 'OR';
    }
    else{
      var whereItem = this.where[$x];
      
      if (whereItem === undefined || whereItem === null){
        this.result.push('`' + this.escape($x) + '` IS NULL');
      }
      else if (Array.isArray(whereItem)){
        var valueItem = "'" + this.escape(whereItem[0]) + "'"
        , oparator = '='
        , oparatorItem = whereItem[1];

        switch(oparatorItem){
          case '$like':
            oparator = 'LIKE';
            valueItem = this.escape(whereItem[0]);
            true === whereItem[2] && (valueItem = '%' + valueItem);
            true === whereItem[3] && (valueItem += '%');
            valueItem = "'" + valueItem + "'";
            break;
          case '$in':
          case '$nin':
            if (Array.isArray(whereItem[0])){
              var me = this;
              valueItem = whereItem[0];
              valueItem = valueItem.map(function(val){
                return "'" + me.escape(val) + "'";
              }).join(",");
              valueItem = "(" + valueItem + ")";
              oparator = oparatorItem === '$in' ? 'IN' : 'NOT IN';
            }
            else if (oparatorItem === '$nin'){
              oparator = '<>';
            }
            break;
          case '$bt':
            if (undefined !== whereItem[2]){
              oparator = 'BETWEEN';
              valueItem = "(" + valueItem + " AND '" + this.escape(whereItem[2]) + "')";
            }
            else{
              oparator = '>=';
            }
            break;
          case '$lt': oparator = '<'; break;
          case '$lte': oparator = '<='; break;
          case '$gt': oparator = '>'; break;
          case '$gte': oparator = '>='; break;
          case '$de': oparator = '<>'; break
        }

        this.result.push('`' + this.escape($x) + '` ' + oparator + ' ' + valueItem);
      }
      else{
        this.result.push("`" + this.escape($x) + "` = '" + this.escape(whereItem) + "'");
      }
    }
  }
}

Where.prototype.escape = function(str){
  return (str + '').replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char){
    switch(char){
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"": case "'": case "\\": case "%": return "\\" + char;
      default: return char;
    }
  });
}

Where.prototype.setAddWhere = function($addWhere){
  this.addWhere = true === $addWhere;
}

Where.prototype.merge = function(){
  if (this.logic === 'OR'){
    this.OR && (this.result = this.result.concat(this.OR.merge()));
    this.AND && this.result.push("(" + this.AND.toString() + ")");
  }
  else{
    this.AND && (this.result = this.result.concat(this.AND.merge()));
    this.OR && this.result.push("(" + this.OR.toString() + ")");
  }

  return this.result;
}

Where.prototype.toString = function($addWhere = false){
  this.setAddWhere($addWhere);
  var result = this.merge().join([' ', ' '].join(this.logic));
  return (this.addWhere ? "WHERE " : '') + result;
}