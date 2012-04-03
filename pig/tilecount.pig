-- Load fields from log data
logs = load '../../../data/tileusagedata/farm/*/*.log' using PigStorage(' ') as (date, time, server, ipaddr, method, url);
-- We wanna count unique hits for URLs
grpd = group logs by url;
-- That's how our output file will look like
smmd = foreach grpd generate group, COUNT(logs.url) as hits;
-- We don't bother picking up hits below 10
flrd = filter smmd by hits > 9;
-- Sort descending
srtd = order flrd by hits desc;
-- Write it back to the file system
store srtd into 'cntd';
