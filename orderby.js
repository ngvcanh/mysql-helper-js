function OrderBy($orderby = {}){

  this.orderby = {};

  this.result = [];

  $orderby && Object.prototype.toString.call($orderby) === '[object Object]' && (this.orderby = $orderby);

  for (var x in this.orderby){
    var type = (this.orderby[x] + "").toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    this.result.push("`" + x + "` " + type);
  }

}

OrderBy.prototype.toString = function(){
  if (!this.result.length) return "";
  return "ORDER BY " + this.result.join(",");
}