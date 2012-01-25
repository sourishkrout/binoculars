-- Load fields from intermediate data
logs = load '../data.txt' as (url:chararray, hits:int);
words = foreach logs generate hits, FLATTEN(STRSPLIT(url, '/', 10));
fltrd = foreach words generate flatten($5) as zoomlevel, flatten($0) as count;
groupd = group fltrd by zoomlevel;
summd = foreach groupd generate group, SUM(fltrd.count) as sum;
store summd into 'smmd';