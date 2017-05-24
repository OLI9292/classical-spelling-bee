import _ from 'underscore';

/**
/* Splits an array into chucks
/* 
/* example:  [1,2,3,4] -> [[1,2], [3,4]]
**/
_.chunk = function(array, size) {
  return array.reduce(function (res, item, index) {
    if (index % size === 0) { res.push([]); }
    res[res.length-1].push(item);
    return res;
  }, []);
}

/**
/* Retrieves n random elements from array
/* 
/* example:   [1,2,3,4], n = 2 -> [1, 3]
**/
_.nRandom = function(arr, n) {
  const shuffled = arr.sort(() => .5 - Math.random());
  return shuffled.slice(0, n);
}
