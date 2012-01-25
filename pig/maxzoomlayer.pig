-- Load fields from intermediate data
logs = load '../data.txt' as (url:chararray, hits:int);
words = foreach logs generate hits, FLATTEN(STRSPLIT(url, '/', 10));
fltrd = foreach words generate flatten($5) as zoomlevel, flatten($0) as count:int;
groupd = group fltrd by zoomlevel;
maxd = foreach groupd generate group, MAX(fltrd.count) as max;
store maxd into 'maxd';