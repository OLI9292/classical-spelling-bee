/**
/* Splits an array into chucks
/* 
/* example:  [1,2,3,4] -> [[1,2], [3,4]]
**/

import _ from 'underscore';

_.chunk = function(array, size) {
  return array.reduce(function (res, item, index) {
    if (index % size === 0) { res.push([]); }
    res[res.length-1].push(item);
    return res;
  }, []);
}
