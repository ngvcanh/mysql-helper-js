function Limit($limit = 0, $start = 0){

  this.result = '';

  this.limit = 0;
  this.start = 0;

  $limit = +$limit;
  $start = +$start;

  $limit && $limit > 0 && (this.limit = $limit);
  $start && $start > 0 && (this.start = $start);

    limit > 0 && (result = ` LIMIT ${ start > 0 ? start + ', ' : '' }${ limit }`);
}

Limit.prototype.toString = function(){
  if (this.limit > 0){
    this.result = 'LIMIT ';
    this.start > 0 && (this.result += this.start + ", ");
    this.result += this.limit;
  }

  return this.limit;
}