function Having($having = {}){

  this.having = {};

  this.result = '';

  $having && Object.prototype.toString.call($having) === '[object Object]' && (this.having = $having);

}

Having.prototype.toString = function(){

  return this.result;

}

function GroupBy($groupby = [], $having = {}){

  this.groupby = [];

  this.having = new Having($having);

  this.result = '';

  Array.isArray($groupby) && (this.groupby = $groupby);

}

GroupBy.prototype.toString = function(){

  if (this.groupby.length){
    this.result = 'GROUP BY `' + this.groupby.join("`,`") + "`";
    this.result += this.having.toString();
  }

  return this.result;

}