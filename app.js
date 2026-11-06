/* The Creator Newsroom: the desk simulation on real data.
   One screen set, five sections, real signals underneath. See README.md for what is real, modelled and simulated. */

/* ===================== SNAPSHOT (real data, embedded fallback; generated from data/live.json by scripts/build_snapshot.py) ===================== */
const SNAPSHOT = /*SNAP*/{"schemaVersion":1,"generatedAt":"2026-11-06T16:44:06Z","generator":"scripts/fetch_data.py","embeddedSnapshot":true,"benchNote":"Illustrative bench of 16 real public YouTube channels found through public YouTube search (not through YouTube Creator Partnerships). No channel has any known relationship with Brooks. Rates, fees and turnaround are not public and are not in this file.","summary":{"creators":16,"creatorsStale":0,"trends":61,"trendsStale":0,"sourcesOk":["youtube_rss","youtube_pages","wikimedia","mediawiki","google_trends"],"sourcesPartial":[],"sourcesFailed":[]},"sources":[{"id":"youtube_rss","name":"YouTube channel RSS feeds","url":"https://www.youtube.com/feeds/videos.xml","status":"ok","ok":19,"failed":0,"lastSuccess":"2026-11-06T16:44:06Z","note":"Latest 15 uploads per channel with public view counts. Server-side only (no CORS)."},{"id":"youtube_pages","name":"YouTube channel pages (public subscriber count)","url":"https://www.youtube.com/","status":"ok","ok":16,"failed":0,"lastSuccess":"2026-11-06T16:44:06Z","note":"Subscriber text read from the channel page header; the channel ID on the page must match."},{"id":"wikimedia","name":"Wikimedia Pageviews REST API","url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/","status":"ok","ok":30,"failed":0,"lastSuccess":"2026-11-06T16:44:06Z","note":"English Wikipedia daily pageviews, agent=user. Also callable from a browser with a plain fetch()."},{"id":"mediawiki","name":"MediaWiki Action API (article title check)","url":"https://en.wikipedia.org/w/api.php","status":"ok","ok":1,"failed":0,"lastSuccess":"2026-11-06T16:44:06Z","note":"Flags configured article titles that were renamed or deleted."},{"id":"google_trends","name":"Google Trends (unofficial web endpoints)","url":"https://trends.google.com/trends/explore","status":"ok","ok":15,"failed":0,"lastSuccess":"2026-11-06T16:44:06Z","note":"Best effort: rate-limited (HTTP 429) and untested from GitHub Actions IPs. Last good values are kept and marked stale on failure."}],"creators":[{"id":"kofuzi","beat":"gear","name":"kofuzi","handle":"@kofuzi","channelId":"UCe43pe3w4L6w3tNMRkWiJBA","url":"https://www.youtube.com/@kofuzi","flags":["Reviews shoes from many brands, competitors included, so exclusivity terms would not fit."],"medianViews15":42241,"uploads30d":12,"uploads30dIsFloor":false,"shortsInLast15":0,"daysSinceLastUpload":0.2,"feedStale":false,"subscribers":243000,"subscribersText":"243K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"doctorsofrunning","beat":"gear","name":"Doctors of Running","handle":"@DoctorsofRunning","channelId":"UCpUtRsyAx5rluUDmF4k_gHw","url":"https://www.youtube.com/@DoctorsofRunning","flags":["Reviews shoes from many brands, competitors included, so exclusivity terms would not fit."],"medianViews15":8173,"uploads30d":10,"uploads30dIsFloor":false,"shortsInLast15":2,"daysSinceLastUpload":2.9,"feedStale":false,"subscribers":51000,"subscribersText":"51K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"keltieoconnor","beat":"beginner","name":"Keltie O'Connor","handle":"@KeltieOConnor","channelId":"UC9zEqIwv7yPQ8IlzNYpB_Aw","url":"https://www.youtube.com/@KeltieOConnor","flags":["General fitness and lifestyle channel, not a dedicated running channel. In the beginner beat for its reach to people who do not run yet; do not call it a running creator."],"medianViews15":104728,"uploads30d":9,"uploads30dIsFloor":false,"shortsInLast15":9,"daysSinceLastUpload":5.1,"feedStale":false,"subscribers":775000,"subscribersText":"775K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"nk-medani","beat":"beginner","name":"NK Medani","handle":"@nk.medani","channelId":"UCNhvxFNlvV3RwR7f3TdAunA","url":"https://www.youtube.com/@nk.medani","flags":[],"medianViews15":7594,"uploads30d":5,"uploads30dIsFloor":false,"shortsInLast15":1,"daysSinceLastUpload":4.9,"feedStale":false,"subscribers":26600,"subscribersText":"26.6K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"philybowden","beat":"marathon","name":"Phily Bowden","handle":"@PhilyBowden","channelId":"UCzCCsm1ry8no4j-gS6TgySQ","url":"https://www.youtube.com/@PhilyBowden","flags":[],"medianViews15":130838,"uploads30d":8,"uploads30dIsFloor":false,"shortsInLast15":7,"daysSinceLastUpload":6.0,"feedStale":false,"subscribers":228000,"subscribersText":"228K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"benisrunning","beat":"marathon","name":"Ben Is Running","handle":"@BenIsRunning","channelId":"UC-vlZFFRyWKx-d3LpoAhNfg","url":"https://www.youtube.com/@BenIsRunning","flags":[],"medianViews15":61897,"uploads30d":4,"uploads30dIsFloor":false,"shortsInLast15":2,"daysSinceLastUpload":5.0,"feedStale":false,"subscribers":159000,"subscribersText":"159K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"jeffpelletier","beat":"trail","name":"Jeff Pelletier","handle":"@JeffPelletier","channelId":"UCNKMpnM_Yvf6E-Hhf9btYqA","url":"https://www.youtube.com/@JeffPelletier","flags":[],"medianViews15":39016,"uploads30d":2,"uploads30dIsFloor":false,"shortsInLast15":6,"daysSinceLastUpload":10.9,"feedStale":false,"subscribers":175000,"subscribersText":"175K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"run4adventure","beat":"trail","name":"Run4Adventure","handle":"@Run4Adventure","channelId":"UCGMbTnk82pK0vmITB5LtiPw","url":"https://www.youtube.com/@Run4Adventure","flags":["A 2026-08-27 livestream title says 'powered by SCOTT Running' (SCOTT sells trail shoes). Relationship unverified.","Reviews shoes from many brands, competitors included, so exclusivity terms would not fit."],"medianViews15":10060,"uploads30d":12,"uploads30dIsFloor":false,"shortsInLast15":1,"daysSinceLastUpload":2.9,"feedStale":false,"subscribers":70500,"subscribersText":"70.5K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"noahanderson14","beat":"community","name":"Noah Anderson","handle":"@noahanderson14","channelId":"UC3B5F11oEtOwI-jXpwT0kHg","url":"https://www.youtube.com/@noahanderson14","flags":[],"medianViews15":61597,"uploads30d":15,"uploads30dIsFloor":true,"shortsInLast15":13,"daysSinceLastUpload":0.1,"feedStale":false,"subscribers":550000,"subscribersText":"550K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"crownmyrun","beat":"community","name":"Crown my Run","handle":"@CrownMyRun","channelId":"UCV9Gjy-Ec1cWMaR_J0KSFXg","url":"https://www.youtube.com/@CrownMyRun","flags":["Below the 20k-subscriber floor (14.7K on 2026-09-22). Kept because no active run-club or parkrun channel between 20k and 200k was found; nearest 20k+ swap is Flora Beverley (@FloraBeverley)."],"medianViews15":11956,"uploads30d":2,"uploads30dIsFloor":false,"shortsInLast15":3,"daysSinceLastUpload":9.9,"feedStale":false,"subscribers":14800,"subscribersText":"14.8K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"allie-ostrander","beat":"womens","name":"Allie Ostrander","handle":"@allie_ostrander","channelId":"UCn5hg2riwFTCNif80JbaA8A","url":"https://www.youtube.com/@allie_ostrander","flags":[],"medianViews15":119597,"uploads30d":12,"uploads30dIsFloor":false,"shortsInLast15":8,"daysSinceLastUpload":1.9,"feedStale":false,"subscribers":141000,"subscribersText":"141K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"hannahtrenches","beat":"womens","name":"Hannah Trenches","handle":"@hannahtrenches","channelId":"UCMbAwEnxe3yIJq06H8Ft5rg","url":"https://www.youtube.com/@hannahtrenches","flags":["A 2026-09-10 title promotes a Gymshark discount code (apparel, not footwear)."],"medianViews15":22102,"uploads30d":8,"uploads30dIsFloor":false,"shortsInLast15":12,"daysSinceLastUpload":3.9,"feedStale":false,"subscribers":27300,"subscribersText":"27.3K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"jamesdunne","beat":"recovery","name":"James Dunne","handle":"@JamesDunne","channelId":"UCEBjuHm_Z6hz8Q6C_dm8bSg","url":"https://www.youtube.com/@JamesDunne","flags":[],"medianViews15":306224,"uploads30d":0,"uploads30dIsFloor":false,"shortsInLast15":0,"daysSinceLastUpload":75.5,"feedStale":false,"subscribers":311000,"subscribersText":"311K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"runbetterwithash","beat":"recovery","name":"Run Better with Ash","handle":"@RunBetterwithAsh","channelId":"UCB2zycIY_qMKZjlE98zO4gg","url":"https://www.youtube.com/@RunBetterwithAsh","flags":[],"medianViews15":6097,"uploads30d":13,"uploads30dIsFloor":false,"shortsInLast15":0,"daysSinceLastUpload":0.0,"feedStale":false,"subscribers":191000,"subscribersText":"191K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"andirenay","beat":"shorts","name":"Andi Renay","handle":"@andirenay","channelId":"UCuchAnfKNzuKQ0T6pBQqurQ","url":"https://www.youtube.com/@andirenay","flags":["Her channel description says she is 21 and runs at FAU. If she is a current college athlete, her school's and the NCAA's NIL rules would apply to any paid deal; not verified."],"medianViews15":13347,"uploads30d":15,"uploads30dIsFloor":true,"shortsInLast15":15,"daysSinceLastUpload":0.6,"feedStale":false,"subscribers":136000,"subscribersText":"136K subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"},{"id":"thefashionjogger","beat":"shorts","name":"The Fashion Jogger","handle":"@TheFashionJogger","channelId":"UC6khvHxqs_5VySwJ6amtG8Q","url":"https://www.youtube.com/@TheFashionJogger","flags":["A 2026-09-21 title tags @nikerunning and @nike on a Nike Alphafly 4 video. Any Nike relationship is unverified."],"medianViews15":53940,"uploads30d":15,"uploads30dIsFloor":true,"shortsInLast15":15,"daysSinceLastUpload":2.9,"feedStale":false,"subscribers":1620000,"subscribersText":"1.62M subscribers","subscribersCapturedAt":"2026-11-06T16:44:06Z","subscribersStale":false,"stale":false,"lastSuccess":"2026-11-06T16:44:06Z"}],"trends":[{"id":"wm-hyrox","topic":"Hyrox (fitness racing)","signal_text":"English Wikipedia views of the 'Hyrox' article: 26,745 in the 7 days to 5 Nov, up 71.3% on the previous 7 days (15,617). Busiest day in the last 28: 30 Oct (8,817 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":26745,"change_pct":71.3,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Hyrox/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"Hyrox","articleUrl":"https://en.wikipedia.org/wiki/Hyrox","note":"Research on 2026-09-22 found the September 2026 spike was driven by a controversy (a red-list example, not a brief). Check the cause of any spike before briefing.","caveats":[]},{"id":"wm-nyc-marathon","topic":"New York City Marathon","signal_text":"English Wikipedia views of the 'New York City Marathon' article: 40,449 in the 7 days to 5 Nov, up 873.3% on the previous 7 days (4,156). Busiest day in the last 28: 1 Nov (17,474 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":40449,"change_pct":873.3,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/New_York_City_Marathon/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"New_York_City_Marathon","articleUrl":"https://en.wikipedia.org/wiki/New_York_City_Marathon","note":null,"caveats":[]},{"id":"wm-boston-marathon","topic":"Boston Marathon","signal_text":"English Wikipedia views of the 'Boston Marathon' article: 5,015 in the 7 days to 5 Nov, up 115.6% on the previous 7 days (2,326). Busiest day in the last 28: 1 Nov (1,494 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":5015,"change_pct":115.6,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Boston_Marathon/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"Boston_Marathon","articleUrl":"https://en.wikipedia.org/wiki/Boston_Marathon","note":null,"caveats":[]},{"id":"wm-parkrun","topic":"parkrun","signal_text":"English Wikipedia views of the 'Parkrun' article: 2,304 in the 7 days to 5 Nov, up 147.7% on the previous 7 days (930). Busiest day in the last 28: 1 Nov (1,207 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":2304,"change_pct":147.7,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Parkrun/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"Parkrun","articleUrl":"https://en.wikipedia.org/wiki/Parkrun","note":null,"caveats":[]},{"id":"wm-plantar-fasciitis","topic":"Plantar fasciitis (health topic: claims register applies)","signal_text":"English Wikipedia views of the 'Plantar fasciitis' article: 3,368 in the 7 days to 5 Nov, down 3.1% on the previous 7 days (3,475). Busiest day in the last 28: 22 Oct (559 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":3368,"change_pct":-3.1,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Plantar_fasciitis/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"Plantar_fasciitis","articleUrl":"https://en.wikipedia.org/wiki/Plantar_fasciitis","note":null,"caveats":[]},{"id":"wm-super-shoes","topic":"Super shoes","signal_text":"English Wikipedia views of the 'Super shoes' article: 1,005 in the 7 days to 5 Nov, up 340.8% on the previous 7 days (228). Busiest day in the last 28: 3 Nov (684 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":1005,"change_pct":340.8,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Super_shoes/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"Super_shoes","articleUrl":"https://en.wikipedia.org/wiki/Super_shoes","note":null,"caveats":[]},{"id":"wm-turkey-trot","topic":"Turkey trots (Thanksgiving races)","signal_text":"English Wikipedia views of the 'Turkey trot' article: 585 in the 7 days to 5 Nov, up 37.0% on the previous 7 days (427). Busiest day in the last 28: 2 Nov (113 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":585,"change_pct":37.0,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Turkey_trot/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"Turkey_trot","articleUrl":"https://en.wikipedia.org/wiki/Turkey_trot","note":"Seasonal: Thanksgiving is 26 Nov 2026.","caveats":[]},{"id":"wm-indy-monumental","topic":"Indianapolis Monumental Marathon","signal_text":"English Wikipedia views of the 'Indianapolis Monumental Marathon' article: 179 in the 7 days to 5 Nov, against 102 in the previous 7 days (no change figure: fewer than 200 views in the previous week, too few for a reliable change figure). Busiest day in the last 28: 5 Nov (41 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":179,"change_pct":null,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Indianapolis_Monumental_Marathon/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"Indianapolis_Monumental_Marathon","articleUrl":"https://en.wikipedia.org/wiki/Indianapolis_Monumental_Marathon","note":"Brooks is a presenting sponsor of this race (official footwear and apparel sponsor; monumentalmarathon.com and Running USA release, checked 23 Sep 2026).","caveats":["No change figure: fewer than 200 views in the previous week, too few for a reliable change figure."]},{"id":"wm-jfk-50","topic":"JFK 50 Mile","signal_text":"English Wikipedia views of the 'JFK 50 Mile' article: 118 in the 7 days to 5 Nov, against 85 in the previous 7 days (no change figure: fewer than 200 views in the previous week, too few for a reliable change figure). Busiest day in the last 28: 12 Oct (26 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":118,"change_pct":null,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/JFK_50_Mile/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"JFK_50_Mile","articleUrl":"https://en.wikipedia.org/wiki/JFK_50_Mile","note":null,"caveats":["No change figure: fewer than 200 views in the previous week, too few for a reliable change figure."]},{"id":"wm-cim","topic":"California International Marathon","signal_text":"English Wikipedia views of the 'California International Marathon' article: 208 in the 7 days to 5 Nov, against 174 in the previous 7 days (no change figure: fewer than 200 views in the previous week, too few for a reliable change figure). Busiest day in the last 28: 14 Oct (104 views).","metric":"English Wikipedia pageviews (agent=user), sum of the last 7 complete days","value":208,"change_pct":null,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Wikimedia Pageviews REST API","source_url":"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/California_International_Marathon/daily/20260903/20261105","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","article":"California_International_Marathon","articleUrl":"https://en.wikipedia.org/wiki/California_International_Marathon","note":null,"caveats":["No change figure: fewer than 200 views in the previous week, too few for a reliable change figure."]},{"id":"gt-run-club","topic":"Run clubs","signal_text":"US Google search interest for 'run club' summed to 411 over the 7 complete days to 5 Nov, down 8.5% on the previous 7 days (449). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 58 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":411,"change_pct":-8.5,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=run%20club","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"run club","partialToday":{"date":"2026-11-06","value":58}},{"id":"gt-couch-to-5k","topic":"Couch to 5K","signal_text":"US Google search interest for 'couch to 5k' summed to 390 over the 7 complete days to 5 Nov, up 15.0% on the previous 7 days (339). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 46 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":390,"change_pct":15.0,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=couch%20to%205k","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"couch to 5k","partialToday":{"date":"2026-11-06","value":46}},{"id":"gt-nyc-marathon","topic":"New York City Marathon","signal_text":"US Google search interest for 'nyc marathon' summed to 211 over the 7 complete days to 5 Nov, up 559.4% on the previous 7 days (32). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 5 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":211,"change_pct":559.4,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=nyc%20marathon","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"nyc marathon","partialToday":{"date":"2026-11-06","value":5}},{"id":"gt-turkey-trot","topic":"Turkey trots","signal_text":"US Google search interest for 'turkey trot' summed to 547 over the 7 complete days to 5 Nov, up 62.3% on the previous 7 days (337). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 72 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":547,"change_pct":62.3,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=turkey%20trot","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"turkey trot","partialToday":{"date":"2026-11-06","value":72}},{"id":"gt-black-friday-running-shoes","topic":"Black Friday running shoe deals","signal_text":"US Google search interest for 'running shoes black friday' summed to 54 over the 7 complete days to 5 Nov, up 217.6% on the previous 7 days (17). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 8 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":54,"change_pct":217.6,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=running%20shoes%20black%20friday","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"running shoes black friday","partialToday":{"date":"2026-11-06","value":8}},{"id":"gt-winter-running","topic":"Winter running","signal_text":"US Google search interest for 'winter running' summed to 158 over the 7 complete days to 5 Nov, up 9.0% on the previous 7 days (145). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 22 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":158,"change_pct":9.0,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=winter%20running","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"winter running","partialToday":{"date":"2026-11-06","value":22}},{"id":"gt-gifts-for-runners","topic":"Gifts for runners","signal_text":"US Google search interest for 'gifts for runners' summed to 288 over the 7 complete days to 5 Nov, up 30.3% on the previous 7 days (221). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 39 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":288,"change_pct":30.3,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=gifts%20for%20runners","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"gifts for runners","partialToday":{"date":"2026-11-06","value":39}},{"id":"gt-marathon-recovery","topic":"Marathon recovery","signal_text":"US Google search interest for 'marathon recovery' summed to 290 over the 7 complete days to 5 Nov, up 21.3% on the previous 7 days (239). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 20 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":290,"change_pct":21.3,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=marathon%20recovery","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"marathon recovery","partialToday":{"date":"2026-11-06","value":20}},{"id":"gt-boston-marathon","topic":"Boston Marathon","signal_text":"US Google search interest for 'boston marathon' summed to 365 over the 7 complete days to 5 Nov, up 67.4% on the previous 7 days (218). Daily index 0-100, relative to the peak of its 3-month chart. Today's partial value is 32 (provisional).","metric":"Google Trends US search interest (0-100 index, 3-month chart), sum of the last 7 complete days","value":365,"change_pct":67.4,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%203-m&geo=US&q=boston%20marathon","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"boston marathon","partialToday":{"date":"2026-11-06","value":32}},{"id":"gt-shoes-ghost-18","topic":"Brooks Ghost 18","signal_text":"US Google search interest for 'ghost 18' summed to 524 over the 7 complete days to 5 Nov, up 18.6% on the previous 7 days (442). Daily index 0-100, relative to the peak of its 1-month five-shoe comparison chart. Today's partial value is 62 (provisional).","metric":"Google Trends US search interest (0-100 index, 1-month five-shoe comparison chart), sum of the last 7 complete days","value":524,"change_pct":18.6,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%201-m&geo=US&q=ghost%2018%2Chyperion%20elite%206%2Cclifton%2011%2Calphafly%204%2Cadios%20pro%205","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts.","The bare keyword 'ghost 18' can also catch searches unrelated to the shoe; read it as an upper bound."],"keyword":"ghost 18","partialToday":{"date":"2026-11-06","value":62}},{"id":"gt-shoes-alphafly-4","topic":"Nike Alphafly 4 (competitor)","signal_text":"US Google search interest for 'alphafly 4' summed to 178 over the 7 complete days to 5 Nov, down 9.2% on the previous 7 days (196). Daily index 0-100, relative to the peak of its 1-month five-shoe comparison chart. Today's partial value is 24 (provisional).","metric":"Google Trends US search interest (0-100 index, 1-month five-shoe comparison chart), sum of the last 7 complete days","value":178,"change_pct":-9.2,"window":"2026-10-30 to 2026-11-05 vs 2026-10-23 to 2026-10-29","source_name":"Google Trends (unofficial web endpoints, best effort)","source_url":"https://trends.google.com/trends/explore?date=today%201-m&geo=US&q=ghost%2018%2Chyperion%20elite%206%2Cclifton%2011%2Calphafly%204%2Cadios%20pro%205","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Index values are relative to the peak of this chart only; do not compare them with other charts."],"keyword":"alphafly 4","partialToday":{"date":"2026-11-06","value":24}},{"id":"yt-bench-fastest-short","topic":"Fastest-moving bench Short this week","signal_text":"'#runner #running #relatable #fitness #funny #jokes #comedy #skit #workout #gym #run' by Andi Renay (shorts beat) has 520,261 views (RSS) 4.7 days after publishing, about 110,592 a day: the fastest of 24 bench Shorts published in the last 7 days and at least 24 hours old.","metric":"YouTube views (RSS) per day since publish","value":110592,"change_pct":null,"window":"Short uploads published 2026-10-30 to 2026-11-06, at least 24 hours old","source_name":"YouTube channel RSS feed (Andi Renay)","source_url":"https://www.youtube.com/shorts/JQ5t2RVRT9M","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":[]},{"id":"yt-kw-beginner","topic":"Beginner running","signal_text":"1 upload in the last 14 days from 1 tracked channel (1 from the bench, 0 from watch channels) matches this topic in the title, with 7,594 views in total (RSS). Most viewed: 'realistic week of marathon training *diet, workouts, outfits* a beginner runner (post knee surgery)' by NK Medani, 7,594 views.","metric":"YouTube views (RSS) summed over matching uploads published in the last 14 days","value":7594,"change_pct":null,"window":"uploads published 2026-10-23 to 2026-11-06","source_name":"YouTube channel RSS feeds (16 bench + 3 watch channels: Believe in the Run, The Run Testers, Ben Parkes)","source_url":"https://www.youtube.com/watch?v=x555zQ7JMsA","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Keyword match on video titles; a match does not mean the video is about the brand or product.","The feed holds only each channel's latest 15 uploads; Andi Renay posted more than that in 14 days, so their counts are floors."]},{"id":"yt-kw-trail-ultra","topic":"Trail and ultra","signal_text":"5 uploads in the last 14 days from 4 tracked channels (3 from the bench, 2 from watch channels) match this topic in the title, with 212,011 views in total (RSS). Most viewed: 'Puma Deviate Pure After 100 Miles' by kofuzi, 96,640 views.","metric":"YouTube views (RSS) summed over matching uploads published in the last 14 days","value":212011,"change_pct":null,"window":"uploads published 2026-10-23 to 2026-11-06","source_name":"YouTube channel RSS feeds (16 bench + 3 watch channels: Believe in the Run, The Run Testers, Ben Parkes)","source_url":"https://www.youtube.com/watch?v=bKQZZr12zrI","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Keyword match on video titles; a match does not mean the video is about the brand or product.","The feed holds only each channel's latest 15 uploads; Andi Renay posted more than that in 14 days, so their counts are floors."]},{"id":"yt-kw-injury-recovery","topic":"Injury, pain and recovery (health topic: claims register applies)","signal_text":"6 uploads in the last 14 days from 2 tracked channels (6 from the bench, 0 from watch channels) match this topic in the title, with 26,376 views in total (RSS). Most viewed: '11 MIN Full Body Stretch for Runners (Post-Run Recovery)' by Run Better with Ash, 8,511 views.","metric":"YouTube views (RSS) summed over matching uploads published in the last 14 days","value":26376,"change_pct":null,"window":"uploads published 2026-10-23 to 2026-11-06","source_name":"YouTube channel RSS feeds (16 bench + 3 watch channels: Believe in the Run, The Run Testers, Ben Parkes)","source_url":"https://www.youtube.com/watch?v=atc2I-QFHjI","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Keyword match on video titles; a match does not mean the video is about the brand or product.","The feed holds only each channel's latest 15 uploads; Andi Renay posted more than that in 14 days, so their counts are floors."]},{"id":"yt-kw-winter","topic":"Winter and cold-weather running","signal_text":"1 upload in the last 14 days from 1 tracked channel (0 from the bench, 1 from watch channels) matches this topic in the title, with 138,655 views in total (RSS). Most viewed: 'I Spent £800 Testing EVERY WINTER RUNNING SHOE - one clear WINNER!' by Ben Parkes, 138,655 views.","metric":"YouTube views (RSS) summed over matching uploads published in the last 14 days","value":138655,"change_pct":null,"window":"uploads published 2026-10-23 to 2026-11-06","source_name":"YouTube channel RSS feeds (16 bench + 3 watch channels: Believe in the Run, The Run Testers, Ben Parkes)","source_url":"https://www.youtube.com/watch?v=lLvB3I-_bIk","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Keyword match on video titles; a match does not mean the video is about the brand or product.","The feed holds only each channel's latest 15 uploads; Andi Renay posted more than that in 14 days, so their counts are floors."]},{"id":"yt-kw-marathon-recovery","topic":"Recovery after a marathon","signal_text":"2 uploads in the last 14 days from 2 tracked channels (2 from the bench, 0 from watch channels) match this topic in the title, with 26,617 views in total (RSS). Most viewed: 'a week of recovery runs' by kofuzi, 18,106 views.","metric":"YouTube views (RSS) summed over matching uploads published in the last 14 days","value":26617,"change_pct":null,"window":"uploads published 2026-10-23 to 2026-11-06","source_name":"YouTube channel RSS feeds (16 bench + 3 watch channels: Believe in the Run, The Run Testers, Ben Parkes)","source_url":"https://www.youtube.com/watch?v=YhvbEiM6MS0","captured":"2026-11-06T16:44:06Z","stale":false,"lastSuccess":"2026-11-06T16:44:06Z","caveats":["Keyword match on video titles; a match does not mean the video is about the brand or product.","The feed holds only each channel's latest 15 uploads; Andi Renay posted more than that in 14 days, so their counts are floors."]}]}/*SNAP*/;

/* ===================== DATA (the desk's own settings and the trend board; sources inline) ===================== */
const DATA = {
  brand: {
    name: "Brooks Running", site: "https://www.brooksrunning.com/en_us/",
    product: "Brooks Ghost 18", short: "Ghost 18", price: 150,
    productUrl: "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/ghost-18/110493.html",
    widths: "Narrow, Medium, Wide and Extra Wide (men's page)",
    racer: "Hyperion Elite 6", racerUrl: "https://www.brooksrunning.com/en_us/featured/unisex-running-shoes/hyperion-elite-6/100054.html",
    trail: "Cascadia 20", trailUrl: "https://www.brooksrunning.com/en_us/mens/shoes/trail-shoes/cascadia-20/110489.html",
    hybrid: "Ghost Trail",
    newProduct: "Ghost Amp",
    verified: "22 Sep 2026",
    note: "Brooks is a real brand chosen for this prototype. It is not involved in the project and has not seen it. Products and prices were read from brooksrunning.com on 22 Sep 2026."
  },
  // The desk's own terms. These are the pilot's working targets from the deck, not facts about any creator.
  desk: { amberAllowance: 8, legalTurnaround: 3, draftDays: 3, pilotTargetDays: 7 },
  boardDate: "4 Nov 2026", // the day the trend cards' angles were written; the signals beneath them refresh daily
  beats: { gear:"Gear", beginner:"Beginners", marathon:"Marathon", trail:"Trail", community:"Run clubs", womens:"Women's running", recovery:"Injury & recovery", shorts:"Shorts" },
  // Sourced figures used on the dashboard. Every entry names its source.
  facts: {
    brief15x: { n: "1.5×", text: "Creator marketing spend is growing 1.5 times faster than overall marketing budgets.", source: "Hackathon brief (NYU SPS × Google, 2026). No public source found for this figure." },
    brief15pct: { n: "15%", text: "Share of surveyed marketers rated high performers in creator marketing.", source: "Hackathon brief (NYU SPS × Google, 2026). No public source found for this figure." },
    iab: { n: "4×", text: "US creator ad spend was projected to grow 26% in 2025, to $37 billion, about four times the growth of the total media industry (5.7%).", source: "IAB, 20 Nov 2025 (a full-year projection)", url: "https://www.iab.com/news/creator-economy-ad-spend-to-reach-37-billion-in-2025-growing-4x-faster-than-total-media-industry-according-to-iab/" },
    timeline: { text: "Typical today: 2 to 6 weeks from first contact to a live sponsored video; a smooth deal with a mid-size brand runs 5 to 6 weeks, and 8 to 12 weeks where enterprise legal review is involved. Deals under two weeks are rare and happen when the relationship exists, the rate is already agreed and the brief is tight.", source: "Creators Agency, Mar 2026 (finance-sector deal data)", url: "https://creatorsagency.co/blog/youtube-brand-deal-timeline-pitch-to-payment", url2: "https://creatorsagency.co/blog/youtube-brand-deals-explained-new-creators", url2label: "the 2 to 6 weeks figure" },
    slow: { text: "Brands with slow, disorganised approvals fall down creators' priority lists over time.", source: "Creators Agency, Mar 2026", url: "https://creatorsagency.co/blog/how-to-activate-youtube-creator-deal-correctly" },
    oldDays: 39,
    oldStages: [["Brief", 6], ["Discovery", 7], ["Contract", 7], ["Script approval", 8], ["Production", 7], ["Final review", 4]],
    oldNote: "The 39-day split is the team's illustrative timeline for a mid-size brand working through an agency. It is a team estimate, not measured data. Published ranges exist only for two stages: contract 7 to 21 days; script review 5 to 7 business days, longer when compliance or legal must sign off, with the agency advising creators to plan 7 to 10 business days (Creators Agency, Mar 2026, finance-sector deal data)."
  },
  // The trend board. Each card points at a real signal in the live data (data/live.json; the embedded SNAPSHOT is the fallback).
  // 'appears' and 'decay' are simulation mechanics: the day a card is revealed and how fast its momentum falls.
  // Angles are editor's notes written on boardDate; the signals beneath them refresh daily.
  board: [
    { id:"n1", live:"gt-nyc-marathon", also:"wm-nyc-marathon", appears:1, decay:6, beat:"marathon", title:"New York: the week after the marathon", angle:"The race was run on Sunday 1 Nov. The desk commissions the aftermath, not the race: recovery week, what the first-timers learned, what the pros changed. Brooks is not an NYRR partner, so no marks and no implied official status.", extra:"Partner check: the NYRR partners page names TCS, Mastercard and New Balance; no Brooks (read in a browser, 22 Sep 2026). Race date from nyrr.org, read 22 Sep 2026." },
    { id:"n2", live:"wm-super-shoes", also:"gt-shoes-alphafly-4", appears:1, decay:5, beat:"gear", title:"Super shoes, after New York", angle:"Attention on racing shoes peaks after a major. One honest comparison from the gear beat: when a $275 carbon racer (the Hyperion Elite 6) makes sense and when the Ghost 18 is the better daily choice. Competitor names go amber." },
    { id:"n3", live:"gt-turkey-trot", also:"wm-turkey-trot", appears:1, decay:3, beat:"beginner", title:"Turkey trots: three weeks out", angle:"Thanksgiving is 26 Nov, and for many people the turkey trot is the first race of the year. A 'three weeks to your first 5K' piece; the Ghost 18 as the first real running shoe, with the four widths shown. No injury language.", extra:"Dates: the Manchester Road Race and the Dallas YMCA Turkey Trot are both on 26 Nov 2026 (official race sites, read 22 Sep 2026)." },
    { id:"n4", live:"wm-indy-monumental", appears:1, decay:6, beat:"marathon", title:"Indianapolis Monumental, Saturday 7 Nov", angle:"Brooks is the race's presenting sponsor, so this is the one date on the calendar where race marks can be cleared through the brand's own agreement rather than refused. A race-weekend piece from a marathoner; the producer clears the marks with the brand before the draft.", extra:"Sponsor check: monumentalmarathon.com lists Brooks as a presenting sponsor, and a Running USA release (Oct 2022) names Brooks the official footwear and apparel sponsor under a three-year deal (both read 23 Sep 2026). The Wikipedia signal for this race is small, which is why its momentum sits at neutral: the case for the piece is the sponsorship, not the search volume." },
    { id:"n5", live:"gt-boston-marathon", also:"wm-boston-marathon", appears:2, decay:5, beat:"marathon", title:"Boston 2027: the long build starts", angle:"Boston searches rose with New York. Entries for April 2027 were confirmed in October; the people who got in are planning now. A 'getting to Boston' piece: the Hyperion Elite 6 as the race shoe, the Ghost 18 for the miles between.", extra:"The B.A.A. told applicants to expect acceptance notices by early October (baa.org, read 22 Sep 2026); the cutoff figure is not quoted here. Race day is 19 Apr 2027." },
    { id:"n6", live:"wm-hyrox", appears:2, decay:4, beat:"community", redList:true, title:"Hyrox: on the red list until the cause is known", angle:"The numbers move again, and the desk has not checked why. The September spike followed a controversy at a Hyrox race, not interest in the sport. The red list says: check the cause before briefing, and do not attach the brand to it.", extra:"Editor's note: Reuters, 16 Sep 2026, reported a Hyrox rule change after an on-course incident (headline seen via Google News RSS on 22 Sep 2026; the athlete is not named here). The cause of the latest rise was not checked on 4 Nov 2026." },
    { id:"n7", live:"gt-black-friday-running-shoes", appears:2, decay:4, beat:"gear", title:"Black Friday deal searches, off a small base", angle:"Black Friday is 27 Nov. Deal searches are small but rising fast. The desk does not run offers through correspondents: price talk is amber and 'cheapest' is red. The honest piece is which Ghost to buy, at full price, and why.", extra:"Caveat: the weekly index sums to a small number, so the change figure swings easily. Read it as early, not large." },
    { id:"n8", live:"gt-winter-running", also:"yt-kw-winter", appears:2, decay:5, beat:"womens", title:"Winter running: the first cold runs", angle:"A practical layering guide with the brand's apparel line, the one piece where the apparel, not the shoe, is the subject. No performance figures; no 'warmest'." },
    { id:"n9", live:"gt-gifts-for-runners", appears:3, decay:5, beat:"community", title:"Gifts for runners", angle:"The season's evergreen piece: a gift guide from a run-club host. The brand appears once; no prices, no offers, no 'best'." },
    { id:"n10", live:"gt-run-club", also:"wm-parkrun", appears:3, decay:4, beat:"community", title:"Run clubs and parkrun", angle:"A night with a real club; the brand is the shoes on the floor, not the subject. Brooks Run Club reports 2 million members (Retail Dive, 10 Feb 2026), which is context, not a claim for the script." },
    { id:"n11", live:"gt-marathon-recovery", also:"yt-kw-marathon-recovery", appears:3, decay:5, beat:"recovery", title:"Marathon recovery week", angle:"Tens of thousands of people ran New York on Sunday (59,226 finished in 2025) and are searching how to recover. A physio's week-after plan; the Ghost 18 for the first easy runs. Any line about preventing or treating injury is a health claim and goes red.", extra:"Finisher figure from nyrr.org, read 22 Sep 2026." },
    { id:"n12", live:"gt-shoes-ghost-18", appears:4, decay:4, beat:"womens", title:"Ghost 18 fit: is the forefoot too low?", angle:"Reviews on 22 May (Doctors of Running) and 24 Jun 2026 (RunToTheFinish) call the forefoot low-volume and the shoe polarising. Show the fit on real feet across all four widths, without defensive language.", extra:"Review sources: doctorsofrunning.com/brooks-ghost-18-review-2026 and runtothefinish.com/brooks-ghost-18-review (accessed 22 Sep 2026)." },
    { id:"n13", live:"wm-cim", appears:4, decay:5, beat:"marathon", title:"CIM, 6 Dec: the last big one of the year", angle:"The California International Marathon is the last major US marathon of the year and a popular Boston qualifier. A 'last chance' build piece from the marathon beat. No footwear partner was found on the race page read on 23 Sep 2026, so the usual no-marks rule applies.", extra:"Race date from runcim.org, read 22 Sep 2026." },
    { id:"n14", live:"yt-bench-fastest-short", appears:5, decay:4, beat:"shorts", title:"The fastest-moving bench Short this week", angle:"Join the format rather than explain it; the brand gets one visual beat. The desk asks for one Short in the same style." },
    { id:"n15", live:"wm-jfk-50", also:"yt-kw-trail-ultra", appears:5, decay:5, beat:"trail", title:"JFK 50, 21 Nov: the trail beat's race", angle:"The trail beat's one race of the season. A fair test of the Cascadia 20 on the towpath miles; say where it stops being the right shoe. Altra, not Brooks, is the race's footwear partner, so no marks.", extra:"Partner check: jfk50mile.org lists Altra (read 23 Sep 2026). Race date read 22 Sep 2026." },
    { id:"n16", live:"gt-couch-to-5k", also:"yt-kw-beginner", appears:6, decay:6, beat:"beginner", title:"New-year runners start searching in December", angle:"Couch to 5K searches build before January. An eight-week plan for a first 5K; the Ghost 18 as the first real running shoe. No injury language." },
    { id:"n17", live:"wm-plantar-fasciitis", also:"yt-kw-injury-recovery", appears:7, decay:4, beat:"recovery", title:"Plantar fasciitis: a health topic", angle:"People are reading about heel pain. The desk can commission a recovery piece, but any line that says a shoe prevents or treats it is a health claim and goes red. This card exists to show the red lane." },
  ],
  claims: {
    red: [
      { re:/prevent(s|ing)? (injur(y|ies)|shin splints|plantar|heel pain)/i, label:"Health claim", detail:"Injury prevention is a health claim. The FTC expects health-benefit claims to be substantiated, and toning-shoe cases cost Reebok $25M and Skechers $40M. Legal must review." },
      { re:/injury[- ]free|pain[- ]free/i, label:"Health claim", detail:"Implies a medical outcome." },
      { re:/\b(cures?|cured|heals?|treats?\s+(?:my|your|the|a|an\s+)?\s*(?:knee|shin|heel|plantar|pain|injur\w*)|fix(?:es)?\s+(?:my|your)\s+(?:knee|shin|heel|plantar))\b/i, label:"Health claim", detail:"Treatment language ('cures', 'heals', 'treats my knee') is a medical claim." },
      { re:/clinically proven|medically proven|doctor[- ]recommended|physio[- ]approved/i, label:"Unsubstantiated endorsement", detail:"Needs documented substantiation and legal sign-off." },
      { re:/guarantee(d|s)?\b/i, label:"Guarantee", detail:"Guarantees create liability. Legal must review." },
      { re:/\b(cheapest|lowest price|price match)\b/i, label:"Pricing claim", detail:"Comparative pricing claims are checked by legal." },
      { re:/giveaway|sweepstake|win a pair/i, label:"Promotion", detail:"Giveaways have their own rules and are not in the agreement." },
      { re:/\bGhost Amp\b/i, label:"New product", detail:"The Ghost Amp is a new product launched for fall 2026: on sale at brooksrunning.com at $150 when read in a browser on 22 and 23 Sep 2026 (the site blocks scripted access; the exact launch day was not verified). New products always go to legal." },
      { re:/official (shoe|partner|sponsor)|partner of the (nyc|new york city|chicago|berlin|boston) marathon/i, label:"Implied race partnership", detail:"Brooks is not a partner of the NYC (NYRR partners page, read 22 Sep 2026: TCS, Mastercard, New Balance), Chicago (Nike) or Berlin (adidas) marathons (race sites checked 23 Sep 2026); Boston was not checked. Where Brooks is a race sponsor, as at the Indianapolis Monumental Marathon, the race's own mark rules apply. Implying official status is a legal matter either way." },
    ],
    amber: [
      { re:/\b(best|greatest|perfect)\b/i, label:"Superlative", detail:"Reword as an opinion ('my favourite') or cut." },
      { re:/\b(fastest|lightest|warmest|#1|number one|revolutionary|game[- ]changing)\b/i, label:"Superlative", detail:"Needs an opinion frame or a source." },
      { re:/\d+\s?%\s?(faster|lighter|more|better|softer|longer|warmer)/i, label:"Performance figure", detail:"A number needs a source from the product team." },
      { re:/\b(HOKA|Clifton|Saucony|Ride 19|ASICS|Novablast|Nike|Pegasus|Alphafly|New Balance|880v15|adidas|Adios Pro)\b/i, label:"Competitor named", detail:"Competitor mentions are amber under the agreement. The list is the daily trainers and racers that compete with the Ghost 18: HOKA Clifton, Saucony Ride 19, ASICS Novablast, Nike Pegasus and Alphafly, New Balance 880v15, adidas Adios Pro (checked on the brands' sites or, for HOKA, trade coverage (Gear Patrol), 22 Sep 2026). Matched in any case." },
      { re:/(discount|promo) code|\d+\s?% off/i, label:"Commercial terms", detail:"Offers must match what the agreement allows." },
    ],
    // A missing disclosure is a red check: the advertiser is liable for its endorsers' disclosures under the FTC Endorsement Guides
    // (16 CFR 255.1(d)), and the FTC says a platform's paid-promotion label is not enough on its own.
    disclosure: { re:/#ad\b|#sponsored\b|paid partnership|\bthis video is sponsored\b/i, label:"Disclosure missing", detail:"No #ad, #sponsored or 'paid partnership'. The brand is liable for this under the FTC Endorsement Guides, so it cannot go out: the disclosure belongs in the video, spoken and on screen, near the start; the description alone is not enough (FTC Endorsement Guides FAQ, 2023)." }
  },
  // Desk test scripts. They are used by the simulation to exercise the three lanes.
  // They are NOT written by, said by or attributed to any correspondent on the bench.
  drafts: [
    "#ad Quick one before Sunday's long run. I've been rotating the Brooks Ghost 18 into my easy days for six weeks, and the thing I keep noticing is how quiet the heel is on pavement. It is not a race shoe and it is not pretending to be. If you're building up to a spring half, this is the pair I'd put on for the boring miles. Link in the description.",
    "#ad Let's talk about the best daily trainer I've run in this year. The Brooks Ghost 18 has replaced two other pairs in my rotation, mostly because the fit is finally right for a wide forefoot. I'll show you the wide version on my actual feet, then we go run.",
    "#ad Something I get asked constantly: how many pairs do you really need? Two. One for easy days, one for the hard ones. The Ghost 18 is my easy-day pair. I've run 12% more miles this block than last and my legs feel fine.",
    "Race week in New York. Here's everything I'm doing between now and Sunday, from the shakeout run to what I eat the night before. I'm wearing the Brooks Ghost 18 for the shakeout, which is the shoe I've done most of my easy miles in this block.",
    "#ad The rocker geometry on the Ghost 18 prevents injury by taking the load off your calves, which is why I've had no niggles this block. If you've been dealing with shin splints, this is the shoe I'd try first.",
    "#ad Zone 2 is overrated, and I'll explain why as a physio. Easy running matters, the heart-rate obsession doesn't. I run my easy days in the Brooks Ghost 18 because it's soft without being sloppy. That's the whole review.",
    "#ad I'm guaranteed to take a minute off your 5K with this shoe, and nothing else I've tried comes close. Use my discount code for 20% off.",
    "#ad I took the Ghost Trail onto the ridge to see where a road shoe stops making sense. Honest answer: it's fine on packed dirt, it's out of its depth on wet rock. Watch to the end for where I'd switch to the Cascadia 20.",
    "#ad We went to a Thursday night run club in Brooklyn to find out why everyone is suddenly joining one. I'm in the Brooks Ghost 18, which you'll see for about two seconds because this video is about the people. Honestly the best night out I've had in months.",
  ],
  // Real race dates, each read from the official race site on 22 Sep 2026.
  calendar: [
    { d:"2026-11-07", e:"Indianapolis Monumental Marathon (Brooks is a presenting sponsor)", u:"https://www.monumentalmarathon.com/" },
    { d:"2026-11-21", e:"JFK 50 Mile", u:"https://www.jfk50mile.org/" },
    { d:"2026-11-22", e:"Philadelphia Marathon", u:"https://www.philadelphiamarathon.com/races/marathon" },
    { d:"2026-11-26", e:"Thanksgiving: Manchester Road Race, Dallas YMCA Turkey Trot", u:"https://www.manchesterroadrace.com/" },
    { d:"2026-12-06", e:"California International Marathon", u:"https://www.runcim.org/" },
  ],
  // Google products in the pilot desk, with the names Google uses in autumn 2026 (checked on official pages, 22 Sep 2026).
  products: [
    ["Trend board", "Google Trends (daily); Insights Finder trending insights (search and YouTube data refreshed monthly, audience data weekly) and the brand pulse report (refresh cadence not published)","https://support.google.com/google-ads/answer/11161206?hl=en", "Here: public stand-ins. Google Trends web data, Wikipedia pageviews and YouTube RSS, refreshed daily by a GitHub Action."],
    ["Bench", "YouTube Creator Partnerships in Google Ads (search across Partner Program creators; Gemini-assisted matching rolling out)", "https://blog.youtube/news-and-events/youtube-creator-partnerships-newfronts-2026/", "Here: 16 real public channels found by public YouTube search, not through Creator Partnerships."],
    ["Brief", "Gemini, drafting from the style guide held in Gemini Notebook (formerly NotebookLM, renamed 16 Jul 2026)", "https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/", "Here: a template filled from the trend card and the correspondent's real channel data."],
    ["First read", "Gemini reading the draft against the claims register in Gemini Notebook", "https://gemini.google/about/", "Here: a rule list with the same three lanes."],
    ["48-hour read", "The Analytics tab in YouTube Creator Partnerships (paid and organic views and engagement) plus the creator's own YouTube Studio realtime report; the brand pulse report and Brand Lift confirm over the wave", "https://support.google.com/google-ads/answer/16901705?hl=en", "Here: a projection from the channel's real median views, labelled simulated."],
    ["Boost", "Creator partnerships boost (formerly Partnership ads, renamed at the March 2026 NewFront): the linked creator video runs as an ad in Demand Gen, Video reach, Video view, Video action, App and Performance Max campaigns; YouTube describes the placements as Shorts and in-stream", "https://support.google.com/google-ads/answer/15223349?hl=en", "Here: an arbitrary ×3.2 multiplier, labelled simulated.", "https://blog.youtube/news-and-events/youtube-creator-partnerships-newfronts-2026/", "rename (NewFront post)"],
  ],
};

/* ===================== LIVE DATA ===================== */
let LIVE = SNAPSHOT || { creators: [], trends: [], sources: [], summary: {} };
let DATA_MODE = "snapshot";    // "live" once data/live.json has loaded
let WM_REFRESHED = 0;          // Wikipedia cards refreshed in this browser

function liveTrend(id){ return (LIVE.trends || []).find(t => t.id === id) || null; }
function creatorList(){ return LIVE.creators || []; }

async function loadLive(){
  try {
    const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch("./data/live.json", { cache: "no-store", signal: ctrl.signal });
    clearTimeout(to);
    if (!r.ok) throw new Error("http " + r.status);
    const j = await r.json();
    if (j && Array.isArray(j.creators) && j.creators.length >= 8 && Array.isArray(j.trends)) { LIVE = j; DATA_MODE = "live"; }
  } catch (e) { /* keep the embedded snapshot */ }
  softRender();
  refreshWikipedia();
}

// Wikimedia's pageviews API allows plain browser requests (Access-Control-Allow-Origin: *).
// Refresh the Wikipedia-backed cards with today's figures; keep the daily file's values if anything fails.
async function refreshWikipedia(){
  const ids = [];
  DATA.board.forEach(c => [c.live, c.also].forEach(id => { if (id && id.startsWith("wm-") && !ids.includes(id)) ids.push(id); }));
  const cards = ids.map(liveTrend).filter(t => t && t.article);
  const end = new Date(Date.now() - 24 * 3600 * 1000); // yesterday UTC (today's total is not complete yet)
  const start = new Date(end.getTime() - 27 * 24 * 3600 * 1000); // 28 days, like the daily script
  const ymd = d => d.toISOString().slice(0, 10).replace(/-/g, "");
  const nice = d => d.toISOString().slice(0, 10);
  for (const t of cards) {
    try {
      const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(t.article)}/daily/${ymd(start)}/${ymd(end)}`;
      const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 5000);
      const r = await fetch(url, { signal: ctrl.signal }); clearTimeout(to);
      if (!r.ok) continue;
      const items = (await r.json()).items || [];
      if (items.length < 14) continue;
      const v = items.slice(-14).map(x => x.views);
      const last7 = v.slice(7).reduce((a, b) => a + b, 0), prev7 = v.slice(0, 7).reduce((a, b) => a + b, 0);
      if (prev7 < 200) continue;
      const peak = items.reduce((a, b) => (b.views > a.views ? b : a));
      const peakIso = String(peak.timestamp || "").replace(/^(\d{4})(\d{2})(\d{2}).*$/, "$1-$2-$3");
      t.value = last7; t.previousValue = prev7; t.change_pct = +((last7 / prev7 - 1) * 100).toFixed(1);
      t.window = `${nice(new Date(end.getTime() - 6 * 24 * 3600 * 1000))} to ${nice(end)} vs the 7 days before`;
      t.signal_text = `English Wikipedia views of the '${t.article.replace(/_/g, " ")}' article: ${fmt(last7)} in the 7 days to ${fmtDay(nice(end))}, ${t.change_pct >= 0 ? "up" : "down"} ${Math.abs(t.change_pct)}% on the previous 7 days (${fmt(prev7)}). Busiest day in the last ${items.length}: ${fmtDay(peakIso)} (${fmt(peak.views)} views).`;
      t.captured = new Date().toISOString(); t.browserRefreshed = true; t.stale = false;
      WM_REFRESHED += 1;
      await new Promise(res => setTimeout(res, 400));
    } catch (e) { /* keep the file's value */ }
  }
  if (WM_REFRESHED) softRender();
}

/* ===================== STATE ===================== */
const KEY = "creator-newsroom-sim-v3";
let state = null;
let screen = "meeting";
const SCREENS = ["meeting", "desk", "standards", "bench", "dashboard", "about"];
let STATE_RESET_NOTE = "";

function freshState(){ return { day:1, pieces:[], amberUsed:0, redLogged:0, log:[], seq:0 }; }
function load(){
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch(e){ s = undefined; }
  if (s && typeof s === "object" && Array.isArray(s.pieces)) { state = Object.assign(freshState(), s); return; }
  state = freshState();
  if (s !== null) STATE_RESET_NOTE = "Saved progress was from an older version of the page and was reset.";
}
// Drop saved pieces whose trend card or correspondent is no longer in the data (a rebalanced bench, a renamed card, an older build).
function pruneState(){
  if (!state || !Array.isArray(state.pieces) || creatorList().length < 8) return;
  const before = state.pieces.length;
  state.pieces = state.pieces.filter(p => cardById(p.trendId) && creatorById(p.creatorId));
  const dropped = before - state.pieces.length;
  if (dropped) { logIt(`${dropped} saved piece${dropped > 1 ? "s" : ""} dropped: the trend card or the correspondent is no longer in the data.`); save(); }
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} }
function logIt(text){ state.log.unshift({ day: state.day, text }); if (state.log.length > 80) state.log.length = 80; }

/* ===================== HELPERS ===================== */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cardById = id => DATA.board.find(t => t.id === id);
const creatorById = id => creatorList().find(c => c.id === id);
const fmt = n => (n == null || isNaN(n)) ? "–" : Number(n).toLocaleString("en-US");
const money = n => "$" + Number(n).toLocaleString("en-US");
const pad = n => String(n).padStart(2, "0");
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
function fmtDate(iso){ if (!iso) return "–"; const d = new Date(iso); if (isNaN(d)) return esc(iso); return d.toLocaleString("en-GB", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", timeZone:"UTC" }) + " UTC"; }
function fmtDay(iso){ if (!iso) return "–"; const d = new Date(iso); if (isNaN(d)) return esc(iso); return d.toLocaleString("en-GB", { day:"numeric", month:"short", timeZone:"UTC" }); }
function toast(msg){ const el = document.getElementById("toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 2400); }
function seeded(n){ const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }
function momBar(m){ const f = clamp(Math.round(m / 10), 0, 10); return "▮".repeat(f) + "▯".repeat(10 - f); }
function srcKind(t){ if (!t) return "nt"; const id = t.id || ""; return id.startsWith("gt-") ? "gt" : id.startsWith("wm-") ? "wm" : id.startsWith("yt-") ? "yt" : "nt"; }
function srcName(t){ const k = srcKind(t); return k === "gt" ? "Google Trends" : k === "wm" ? "Wikipedia pageviews" : k === "yt" ? "YouTube RSS" : "Signal"; }

// Momentum is derived from the real signal. Week-on-week change maps to 50 + change/2 (so +100% = 100, 0% = 50, -80% = 10).
// YouTube view totals, which have no week-on-week figure, map to 50 + 20 × log10(views / 10,000) (10k = 50, 100k = 70, 1M = 90).
// A search or pageview signal with no change figure (the fetcher writes null when the base is too small) is neutral, 50.
function momentumBase(card){
  const t = liveTrend(card.live);
  if (!t) return 50;
  if (t.change_pct != null && !isNaN(t.change_pct)) return clamp(Math.round(50 + t.change_pct / 2), 10, 100);
  if (srcKind(t) === "yt" && t.value) return clamp(Math.round(50 + 20 * Math.log10(t.value / 10000)), 15, 100);
  return 50;
}
function momentumNote(card){
  const t = liveTrend(card.live);
  if (!t) return "no signal in the data: neutral 50";
  if (t.change_pct != null && !isNaN(t.change_pct)) return "50 + week-on-week change ÷ 2";
  if (srcKind(t) === "yt" && t.value) return "50 + 20 × log10(views ÷ 10,000)";
  return "no change figure in the data: neutral 50";
}
function momentumNow(card){ if (state.day < card.appears) return null; return Math.max(0, momentumBase(card) - (state.day - card.appears) * card.decay); }

/* ===================== BENCH (real channels; rates and index are computed, and labelled) ===================== */
// Rate estimate. Sources: Agentio 2026 Playbook (average CPM by views tier: under 50k views $51, 50k to 300k $28, 300k+ $22;
// pay on first-30-day views); Creators Agency rate card 2026 (fee = normal views / 1,000 × CPM; usage rights +20% per 30 days);
// Agentio, 3 Sep 2026 (since YouTube's 24 Aug 2026 view-count change, about 52% of new public views in Fitness are engaged views).
// A Short is priced at half the integration, from one finance-sector Shorts benchmark (Creators Agency), so it is low confidence.
function estimateRates(c){
  if (!c.medianViews15) return null;
  const engaged = Math.round(c.medianViews15 * 0.52);
  const cpm = engaged < 50000 ? 51 : engaged < 300000 ? 28 : 22;
  const integration = Math.round(engaged * cpm / 1000 / 10) * 10;
  return { engaged, cpm, integration: Math.max(50, integration), short: Math.max(30, Math.round(integration * 0.5 / 10) * 10) };
}
function viewsPerSub(c){ return (c.medianViews15 && c.subscribers) ? c.medianViews15 / c.subscribers : null; }
function benchMedianVps(){ const v = creatorList().map(viewsPerSub).filter(x => x != null).sort((a, b) => a - b); if (!v.length) return 1; const m = Math.floor(v.length / 2); return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2; }
function reachIndex(c){ const v = viewsPerSub(c); if (v == null) return null; return +(v / benchMedianVps()).toFixed(2); }

/* ===================== STANDARDS CHECK (stands in for the Gemini first read) ===================== */
function checkDraft(text){
  const hits = [];
  DATA.claims.red.forEach(r => { const m = text.match(r.re); if (m) hits.push({ lane:"red", label:r.label, detail:r.detail, match:m[0] }); });
  if (!DATA.claims.disclosure.re.test(text)) hits.push({ lane:"red", label:DATA.claims.disclosure.label, detail:DATA.claims.disclosure.detail, match:null });
  DATA.claims.amber.forEach(r => { const m = text.match(r.re); if (m) hits.push({ lane:"amber", label:r.label, detail:r.detail, match:m[0] }); });
  const lane = hits.some(h => h.lane === "red") ? "red" : hits.length ? "amber" : "green";
  return { lane, hits };
}
// Editor's marks: each flagged phrase is underlined and numbered; the numbers match the list of marks beneath the copy.
function markUp(text, hits){
  let out = esc(text);
  hits.forEach((h, i) => {
    if (!h.match) return;
    const m = esc(h.match).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(m, "i"), x => `<mark class="${h.lane === "red" ? "r" : "a"}">${x}<sup>${i + 1}</sup></mark>`);
  });
  return out;
}
function marksList(hits){
  if (!hits.length) return `<p class="small muted" style="margin:10px 0 0">Nothing flagged. Disclosure present.</p>`;
  return `<ol class="marks">${hits.map((h, i) => `<li class="${h.lane === "red" ? "r" : "a"}"><sup>${i + 1}</sup><span><b>${h.label}</b>${h.match ? ` ("${esc(h.match)}")` : ""}. ${h.detail}</span></li>`).join("")}</ol>`;
}

/* ===================== DESK ACTIONS ===================== */
const pieceTitle = p => { const t = cardById(p.trendId); return t ? t.title : String(p.trendId); };
function oldPostDiscovery(){ return DATA.facts.oldStages.slice(2).reduce((s, [, d]) => s + d, 0); } // the stages after a commission exists
function bestCorrespondent(beat){
  const busy = new Set(state.pieces.filter(p => ["assigned","amber","legal"].includes(p.status)).map(p => p.creatorId));
  const cands = creatorList().filter(c => c.beat === beat).sort((a,b) => (b.medianViews15 || 0) - (a.medianViews15 || 0));
  if (!cands.length) return { c: null, why: "No correspondent on that beat" };
  const free = cands.find(c => !busy.has(c.id));
  if (!free) return { c: null, why: `Both ${DATA.beats[beat] || beat} correspondents are on a piece; try again when one clears` };
  return { c: free, why: "" };
}
function makeBrief(card, c, due){
  const t = liveTrend(card.live);
  const est = estimateRates(c);
  return `BRIEF  ${c.name} (${c.handle})\n` +
    `PIECE  ${card.title}\n` +
    `WHY NOW  ${t ? t.signal_text : card.title} Seen day ${card.appears}, momentum ${momentumNow(card)} today.\n` +
    `ANGLE  ${card.angle}\n` +
    `SAY  ${DATA.brand.product} by name once, in your own words. Show it in use.\n` +
    `DO NOT SAY  Health or injury claims. Performance figures without a source. Superlatives. Competitor names. Race marks or implied official status. Offers beyond the agreement.\n` +
    `DELIVERABLE  One integration of 60 to 90 seconds inside a regular upload, plus one Short.\n` +
    `DISCLOSURE  Say it on camera near the start, on screen, and #ad in the first line of the description (FTC).\n` +
    `RATE CARD  Integration ${est ? money(est.integration) : "–"}, Short ${est ? money(est.short) : "–"} (quarterly agreement). Boost rights included.\n` +
    `DRAFT DUE  Day ${due} (the desk's standard term: ${DATA.desk.draftDays} days)`;
}
function commission(cardId){
  const card = cardById(cardId);
  if (!card) { toast("Unknown trend card"); return; }
  if (card.redList) { toast("Red list: the desk does not brief this"); return; }
  const mom = momentumNow(card);
  if (mom === null || mom < 25) { toast("Too late: the trend has faded"); return; }
  if (state.pieces.some(p => p.trendId === cardId && p.status !== "killed")) { toast("Already commissioned"); return; }
  const pick = bestCorrespondent(card.beat); const c = pick.c;
  if (!c) { toast(pick.why); return; }
  const due = state.day + DATA.desk.draftDays;
  state.seq += 1;
  const p = { id:"p" + state.seq, n: state.seq, trendId: cardId, creatorId:c.id, commissionedDay: state.day, draftDueDay: due, status:"assigned",
    brief: makeBrief(card, c, due), draft:null, check:null, publishDay:null, liveDay:null, readDay:null, metrics:null, boosted:false, legalReturnDay:null, history:[`Day ${state.day}: commissioned, assigned to ${c.name}`] };
  state.pieces.unshift(p);
  logIt(`Commissioned <b>${esc(card.title)}</b> to ${esc(c.name)}. Brief drafted from the style guide. Draft due day ${due}.`);
  save(); render(); toast("Commissioned. Brief drafted for " + c.name + ".");
}
function resolveAmber(pid, choice){
  const p = state.pieces.find(x => x.id === pid); if (!p || p.status !== "amber") return; const title = pieceTitle(p);
  if (choice === "legal") {
    p.status = "legal"; p.legalReturnDay = state.day + DATA.desk.legalTurnaround; state.redLogged += 1;
    p.history.push(`Day ${state.day}: editor escalated to legal; back on day ${p.legalReturnDay}`);
    logIt(`Editor escalated <b>${esc(title)}</b> to legal. Logged.`); save(); render(); return;
  }
  if (state.amberUsed >= DATA.desk.amberAllowance) { toast(`The monthly amber allowance (${DATA.desk.amberAllowance}) is used: send it to legal or kill it`); return; }
  state.amberUsed += 1;
  const extra = choice === "change" ? 1 : 0;
  p.status = "cleared"; p.publishDay = state.day + 1 + extra;
  p.history.push(`Day ${state.day}: editor ${choice === "change" ? "asked for one change" : "approved as submitted"} (amber ${state.amberUsed} of ${DATA.desk.amberAllowance})`);
  logIt(`Amber decision on <b>${esc(title)}</b>: ${choice === "change" ? "one change requested" : "approved"}. Publishes day ${p.publishDay}.`);
  save(); render();
}
function killPiece(pid){
  const p = state.pieces.find(x => x.id === pid); if (!p) return; const title = pieceTitle(p);
  p.status = "killed"; p.history.push(`Day ${state.day}: piece killed`);
  logIt(`Killed <b>${esc(title)}</b>. The kill fee in the agreement applies.`); save(); render();
}
function boost(pid){
  const p = state.pieces.find(x => x.id === pid); if (!p || !p.metrics || p.boosted) return; const title = pieceTitle(p);
  // The 48-hour read stays as it was; the boosted figure is kept separately. ×3.2 is arbitrary: no published benchmark was found.
  p.boosted = true; p.status = "boosted";
  p.metrics.boostViews = Math.round(p.metrics.views * 3.2); p.metrics.boostEngaged = Math.round(p.metrics.boostViews * 0.52);
  p.history.push(`Day ${state.day}: boosted`);
  logIt(`Boosted <b>${esc(title)}</b>.`); save(); render(); toast("Boosted");
}

/* ===================== THE CLOCK ===================== */
function advanceDay(){
  state.day += 1;
  const d = state.day;
  state.pieces.forEach(p => {
    const t = cardById(p.trendId), c = creatorById(p.creatorId);
    if (!t || !c) return;
    if (p.status === "assigned" && d >= p.draftDueDay) {
      const order = [0, 1, 4, 7, 2, 3, 5, 6, 8]; // green, amber, red, green, amber, red (no disclosure), green, red, amber
      p.draft = DATA.drafts[order[(p.n - 1) % order.length]];
      p.check = checkDraft(p.draft);
      p.history.push(`Day ${d}: draft submitted; first read ${p.check.lane}`);
      if (p.check.lane === "green") { p.status = "cleared"; p.publishDay = d + 1; logIt(`<b>${esc(t.title)}</b> cleared on first read. Publishes day ${p.publishDay}.`); }
      else if (p.check.lane === "amber") { p.status = "amber"; p.amberSince = d; logIt(`<b>${esc(t.title)}</b> flagged amber (${p.check.hits.map(h => h.label).join(", ")}). Editor decision due within 24 hours.`); }
      else { p.status = "legal"; p.legalReturnDay = d + DATA.desk.legalTurnaround; state.redLogged += 1; logIt(`<b>${esc(t.title)}</b> flagged red (${p.check.hits.filter(h => h.lane === "red").map(h => h.label).join(", ")}). Sent to legal, back day ${p.legalReturnDay}.`); }
    }
    if (p.status === "legal" && d >= p.legalReturnDay) {
      p.status = "cleared"; p.publishDay = d + 1; p.history.push(`Day ${d}: legal returned the piece with changes`);
      logIt(`Legal returned <b>${esc(t.title)}</b> with changes. Publishes day ${p.publishDay}.`);
    }
    if (p.status === "cleared" && d >= p.publishDay) {
      p.status = "live"; p.liveDay = d; p.readDay = d + 2; p.history.push(`Day ${d}: live`);
      logIt(`<b>${esc(t.title)}</b> is live. Trend-to-live ${d - t.appears} days.`);
    }
    if ((p.status === "live" || p.status === "boosted") && !p.metrics && d >= p.readDay) {
      // Simulated 48-hour projection: the channel's real median views (last 15 uploads, RSS) × (0.35 + 0.45 × momentum/100) × a seeded factor 0.7 to 1.5.
      const base = c.medianViews15 || 5000;
      const mom = Math.max(0.2, (momentumNow(t) || 20) / 100);
      const r = 0.7 + seeded(p.n) * 0.8;
      const views = Math.round(base * (0.35 + 0.45 * mom) * r);
      p.metrics = { views, engaged: Math.round(views * 0.52), median: base, vsMedian: Math.round((views / base - 1) * 100) };
      p.history.push(`Day ${d}: 48-hour read available`);
      logIt(`48-hour read on <b>${esc(t.title)}</b>: ${fmt(views)} public views, ${fmt(p.metrics.engaged)} engaged, against a channel median of ${fmt(base)}.`);
    }
  });
  DATA.board.filter(t => t.appears === d).forEach(t => { const lt = liveTrend(t.live); logIt(`New on the board: <b>${esc(t.title)}</b> (${esc(srcName(lt))}).`); });
  save(); render();
}
function resetAll(){ if (!confirm("Reset the desk to day 1?")) return; state = freshState(); save(); render(); }

/* ===================== RENDER ===================== */
const NAV = [["meeting", "A · Morning meeting"], ["desk", "B · The desk"], ["standards", "C · Standards"], ["bench", "D · The bench"], ["dashboard", "E · Dashboard"]];
function staleCount(){ return (LIVE.creators || []).filter(c => c.stale || c.feedStale || c.subscribersStale).length + (LIVE.trends || []).filter(t => t.stale).length; }
function fileAgeHours(){ const d = new Date(LIVE.generatedAt); return isNaN(d) ? null : (Date.now() - d.getTime()) / 36e5; }
const FILE_OLD_AFTER_H = 36; // the Action runs daily; older than this means it has not run or has failed
function dataIndicator(){
  const el = document.getElementById("dataInd");
  const gen = LIVE.generatedAt, age = fileAgeHours(), old = age != null && age > FILE_OLD_AFTER_H;
  const stale = staleCount();
  const tail = (stale ? ` · ${stale} stale` : "") + (WM_REFRESHED ? ` · ${WM_REFRESHED} refreshed in browser` : "");
  const wmNote = WM_REFRESHED ? "; the Wikipedia cards were then refreshed directly from the Wikimedia API in this browser" : "";
  if (DATA_MODE === "live" && !old) { el.className = "dataind live"; el.textContent = `Data · daily file ${fmtDate(gen)}` + tail; el.title = "data/live.json, written by the daily GitHub Action, loaded when the page opened" + wmNote; }
  else if (DATA_MODE === "live") { el.className = "dataind snap"; el.textContent = `Data · file from ${fmtDate(gen)}, not refreshed since` + tail; el.title = `data/live.json loaded, but it is more than ${FILE_OLD_AFTER_H} hours old: the daily GitHub Action has not run or has failed` + wmNote; }
  else { el.className = "dataind snap"; el.textContent = `Data · snapshot ${fmtDate(gen)}` + tail; el.title = "data/live.json could not be loaded; this is the copy embedded in the page" + wmNote; }
}
// Re-render after data arrives, unless the visitor is typing or on a screen the data does not change.
function softRender(){
  const a = document.activeElement;
  if ((a && a.tagName === "TEXTAREA") || screen === "standards") { dataIndicator(); return; }
  render();
}
function render(){
  pruneState();
  document.getElementById("dayNum").textContent = pad(state.day);
  document.getElementById("brandLine").textContent = DATA.brand.name + " · creator desk";
  dataIndicator();
  const pending = state.pieces.filter(p => p.status === "amber").length + state.pieces.filter(p => p.status === "live" && p.metrics && !p.boosted).length;
  document.getElementById("nav").innerHTML = NAV.map(([id, label]) =>
    `<button class="${screen === id ? "on" : ""}" onclick="go('${id}')">${label}${id === "desk" && pending ? `<span class="n">${pending}</span>` : ""}</button>`).join("");
  const views = { meeting, desk, standards, bench, dashboard, about };
  document.getElementById("main").innerHTML = (views[screen] || meeting)();
}
function go(id, keepHash){ if (!SCREENS.includes(id)) id = "meeting"; screen = id; if (!keepHash) history.replaceState(null, "", "#" + id + (document.body.classList.contains("demo") ? "/demo" : "")); render(); window.scrollTo(0,0); }
function stamp(l, text){ const cls = { green:"g", amber:"a", red:"r", blue:"b", grey:"n" }[l] || "n"; return `<span class="stamp ${cls}">${text || l}</span>`; }
function srcLine(t){
  if (!t) return `<div class="srcline">No live signal for this card in the data file.</div>`;
  const when = t.browserRefreshed ? `refreshed in this browser ${fmtDate(t.captured)}` : `captured ${fmtDate(t.captured)}`;
  return `<div class="srcline">${esc(srcName(t))} · <a href="${esc(t.source_url)}" target="_blank" rel="noopener">source</a> · ${when}${t.stale ? ` · <span class="stale">stale: last good value from ${fmtDay(t.lastSuccess)}</span>` : ""}${t.caveats && t.caveats.length ? ` · <span title="${esc(t.caveats.join(" "))}">caveat</span>` : ""}</div>`;
}

function meeting(){
  const visible = DATA.board.filter(t => state.day >= t.appears).sort((a,b) => (momentumNow(b)||0) - (momentumNow(a)||0));
  const rows = visible.map(card => {
    const m = momentumNow(card); const faded = m < 25;
    const done = state.pieces.find(p => p.trendId === card.id && p.status !== "killed");
    const killed = done ? null : state.pieces.find(p => p.trendId === card.id && p.status === "killed");
    const t = liveTrend(card.live), also = card.also ? liveTrend(card.also) : null;
    let action;
    if (card.redList) action = stamp("red", "Red list · not briefed") + `<span class="small muted">The editor checks the cause and passes.</span>`;
    else if (done) action = stamp("blue", `Commissioned · piece ${pad(done.n)}`);
    else if (faded) action = (killed ? stamp("grey", `Killed · piece ${pad(killed.n)}`) : "") + stamp("grey", "Faded, too late to cover");
    else action = (killed ? stamp("grey", `Killed · piece ${pad(killed.n)}`) : "") + `<button class="btn" onclick="commission('${card.id}')">${killed ? "Re-commission" : "Commission"}</button>`;
    return `<div class="item ${faded ? "faded" : ""}">
      <div class="slug"><b>Day ${pad(card.appears)}</b>${esc(srcName(t))}<br>${DATA.beats[card.beat] || esc(card.beat)}</div>
      <div>
        <h3>${esc(card.title)}</h3>
        <p>${t ? esc(t.signal_text) : "No live signal for this card in the data file."}</p>
        ${srcLine(t)}
        ${also ? `<p style="margin-top:8px">${esc(also.signal_text)}</p>${srcLine(also)}` : ""}
        <p class="angle"><span class="lab">Angle</span>${esc(card.angle)}</p>
        ${card.extra ? `<p class="srcline">${esc(card.extra)}</p>` : ""}
        <div class="actions">${action}</div>
      </div>
      <div class="mom" title="Momentum: ${esc(momentumNote(card))}, minus ${card.decay} for each day since day ${card.appears}">${m}<i>momentum</i><span class="bar">${momBar(m)}</span></div>
    </div>`;
  }).join("");
  return `<div class="kicker">Section A · 09:00</div>
  <h2 class="headline">Morning meeting, day ${pad(state.day)}</h2>
  <p class="dek">Ten minutes. The editor, the producer and the analyst look at what is rising in the category and what people are asking about the brand, and pick what to cover today; everything else waits. Every signal on the board links to its source. Momentum falls every day a trend is not covered.</p>
  <div class="cols">
    <div class="wire">${rows || `<div class="empty">Nothing on the board yet. Advance a day.</div>`}</div>
    <aside class="side">
      <p class="sub">How a commission works</p>
      <p>Commission sends the trend to the correspondent on that beat with the higher median views who is not already on a piece. A brief is drafted from the style guide, the rate card applies, and the draft is due in ${DATA.desk.draftDays} days. No outreach, no negotiation, no sign-off meeting.</p>
      <p class="note">The board is fed by Google Trends web data, Wikipedia pageviews and YouTube feeds, refreshed daily. Each card links to its source. Angles were written on ${esc(DATA.boardDate)}; the signals beneath them refresh.</p>
      <p class="sub" style="margin-top:28px">Desk log</p>
      <div class="log">${state.log.slice(0,10).map(l => `<div><span class="d">D${pad(l.day)}</span>${l.text}</div>`).join("") || `<div class="muted">Nothing yet.</div>`}</div>
    </aside>
  </div>`;
}

const STEPS = ["Commissioned", "Draft", "First read", "Cleared", "Live", "Boosted"];
function stepIndex(p){ return { assigned:1, amber:2, legal:2, cleared:3, live:4, boosted:5, killed:2 }[p.status]; }
function pieceBlock(p){
  const t = cardById(p.trendId), c = creatorById(p.creatorId);
  if (!t || !c) return "";
  const idx = stepIndex(p);
  const stages = STEPS.map((s, i) => `<span class="${i < idx ? "done" : i === idx ? "now" : ""}">${s}</span>`).join(`<span class="sep">→</span>`);
  let status = "", actions = "";
  if (p.status === "assigned") status = stamp("grey", `Draft due day ${pad(p.draftDueDay)}`);
  if (p.status === "amber") {
    const late = state.day > p.amberSince + 1;
    const capped = state.amberUsed >= DATA.desk.amberAllowance;
    status = stamp("amber", "Amber") + (late ? stamp("red", "24-hour window missed") : stamp("grey", `Decide by day ${pad(p.amberSince + 1)}`)) + (capped ? `<span style="color:var(--red)">The monthly amber allowance (${DATA.desk.amberAllowance}) is used: this piece goes to legal or is killed.</span>` : "");
    actions = `<button class="btn" onclick="resolveAmber('${p.id}','approve')"${capped ? " disabled title='Amber allowance used this month'" : ""}>Approve as submitted</button>
      <button class="btn ghost" onclick="resolveAmber('${p.id}','change')"${capped ? " disabled title='Amber allowance used this month'" : ""}>Ask for one change · +1 day</button>
      <button class="btn ghost" onclick="resolveAmber('${p.id}','legal')">Send to legal</button>
      <button class="btn ghost" onclick="killPiece('${p.id}')">Kill</button>`;
  }
  if (p.status === "legal") status = stamp("red", "Red") + stamp("grey", `With legal, back day ${pad(p.legalReturnDay)}`);
  if (p.status === "cleared") status = stamp("green", "Cleared") + stamp("grey", `Publishes day ${pad(p.publishDay)}`);
  if (p.status === "live" || p.status === "boosted") {
    status = stamp("blue", `Live since day ${pad(p.liveDay)}`) + stamp("grey", `Trend-to-live ${p.liveDay - t.appears} days`) + (p.boosted ? stamp("red", "Boosted") : "");
    if (p.metrics) {
      status += `<span>48-hour read: <b>${fmt(p.metrics.views)}</b> public views · ${fmt(p.metrics.engaged)} engaged · ${p.metrics.vsMedian >= 0 ? "+" : ""}${p.metrics.vsMedian}% against the channel's real median of ${fmt(p.metrics.median)}</span>${p.metrics.boostViews ? `<span>After boost: ${fmt(p.metrics.boostViews)} public views · ${fmt(p.metrics.boostEngaged)} engaged</span>` : ""}`;
      if (!p.boosted) actions = `<button class="btn red" onclick="boost('${p.id}')">Boost</button>`;
    } else status += `<span class="muted">48-hour read available day ${pad(p.readDay)}</span>`;
  }
  if (p.status === "killed") status = stamp("grey", "Killed");
  const read = p.check ? `<details><summary>First read against the standards</summary>
      <div style="margin-top:8px">${stamp(p.check.lane, p.check.lane)}</div>
      <pre class="copy">${markUp(p.draft, p.check.hits)}</pre>${marksList(p.check.hits)}</details>` : "";
  return `<article class="piece">
    <header><div><div class="meta">Piece ${pad(p.n)} · <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.name)}</a> ${esc(c.handle)} · ${DATA.beats[c.beat] || esc(c.beat)} · commissioned day ${pad(p.commissionedDay)}</div><h3>${esc(t.title)}</h3></div><div class="status">${status}</div></header>
    <div class="stages">${stages}</div>
    <div class="actions">${actions}</div>
    <details><summary>Brief</summary><pre class="copy">${esc(p.brief)}</pre></details>
    ${read}
    <details><summary>History</summary><ol class="marks">${p.history.map((h, i) => `<li><sup style="color:var(--mute)">${i + 1}</sup><span>${esc(h)}</span></li>`).join("")}</ol>
      <p class="note">For comparison: on the illustrative ${DATA.facts.oldDays}-day timeline the stages after a commission exists (contract, script approval, production, final review) take ${oldPostDiscovery()} days, so the same piece would go live about day ${p.commissionedDay + oldPostDiscovery()}; published ranges put a typical deal at 2 to 6 weeks from first contact (Creators Agency, 2026, finance-sector deal data).</p></details>
  </article>`;
}
function desk(){
  const open = state.pieces.filter(p => p.status !== "killed");
  const needs = open.filter(p => p.status === "amber");
  return `<div class="kicker">Section B</div>
  <h2 class="headline">The desk</h2>
  <p class="dek">Every piece in flight, from commission to boost. Three people run it: the editor commissions and clears, the producer keeps the bench moving, the analyst reads the numbers. Amber pieces need a decision from the editor within 24 hours. Red pieces are with legal. Everything else moves on its own when you advance the day.</p>
  ${needs.length ? `<div class="alert"><b>Decision needed</b>${needs.length} amber ${needs.length === 1 ? "piece" : "pieces"} waiting on the editor. Amber used this month: ${state.amberUsed} of ${DATA.desk.amberAllowance}.${state.amberUsed >= DATA.desk.amberAllowance ? ` <span style="color:var(--red)">Allowance used: further ambers go to legal or are killed.</span>` : ""}</div>` : ""}
  <div class="wire">${open.length ? open.map(pieceBlock).join("") : `<div class="empty">No pieces yet. Go to the morning meeting and commission something.</div>`}</div>
  ${state.pieces.some(p => p.status === "killed") ? `<details><summary>Killed pieces</summary>${state.pieces.filter(p => p.status === "killed").map(pieceBlock).join("")}</details>` : ""}`;
}

function standards(){
  const rules = l => DATA.claims[l].map(r => `<tr><td>${r.label}</td><td>${r.detail}</td></tr>`).join("");
  return `<div class="kicker">Section C</div>
  <h2 class="headline">Standards</h2>
  <p class="dek">The style guide, the claims register and the disclosure rule. Legal signs this page once a quarter. Every draft gets a first read against it, which sorts the piece into a lane; only the amber and red lanes involve a person. The register follows the FTC's own advice that an advertiser should give its creators a list of the claims they may make.</p>
  <div class="cols">
    <div>
      <p class="sub">Copy desk · test a script</p>
      <textarea id="testText" spellcheck="false">#ad The Brooks Ghost 18 is the best shoe for beginners because the rocker prevents injury. I'd pick it over the Saucony Ride 19 every time, it's 20% more comfortable, and I guarantee you'll love it. Use my promo code for 20% off.</textarea>
      <div class="actions" style="margin-top:10px"><button class="btn" onclick="runTest()">Run the first read</button><span class="small muted">Paste a draft, or edit the sample.</span></div>
      <div id="testOut" style="margin-top:18px"></div>
    </div>
    <aside class="side">
      <p class="sub">The three lanes</p>
      <dl class="lanes" style="margin:0">
        <dt class="g">Green</dt><dd>Inside the standards. Cleared by the desk the same day; publishes the next.</dd>
        <dt class="a">Amber</dt><dd>A superlative, a figure without a source, a competitor named, an offer outside the agreement. The editor decides within 24 hours. Capped at ${DATA.desk.amberAllowance} a month.</dd>
        <dt class="r">Red</dt><dd>Health claims, guarantees, pricing, promotions, a new product, an implied race partnership, or a missing disclosure. Always to legal, always logged. Back in ${DATA.desk.legalTurnaround} days.</dd>
      </dl>
      <p class="note">Every draft is read against this register before it reaches the editor. The allowance and the legal turnaround are the desk's standing terms.</p>
      <p class="sub" style="margin-top:28px">Claims register</p>
      <table class="rules"><tr><th>Red · to legal</th><th></th></tr>${rules("red")}<tr><td>${DATA.claims.disclosure.label}</td><td>${DATA.claims.disclosure.detail}</td></tr></table>
      <table class="rules" style="margin-top:18px"><tr><th>Amber · to the editor</th><th></th></tr>${rules("amber")}</table>
      <p class="sub" style="margin-top:28px">Where the rules come from</p>
      <ul class="tight small">
        <li>Disclosure: in the video, spoken and on screen, near the start; the description alone is not enough; a platform's paid-promotion label is not enough on its own. <a href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" target="_blank" rel="noopener">FTC, Disclosures 101</a>; <a href="https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking" target="_blank" rel="noopener">FTC Endorsement Guides FAQ</a>.</li>
        <li>Health claims need substantiation; the advertiser is liable for what its endorsers say (16 CFR 255.1(d)). <a href="https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance" target="_blank" rel="noopener">FTC Health Products Compliance Guidance</a>; <a href="https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255" target="_blank" rel="noopener">16 CFR 255</a>.</li>
        <li>Footwear precedents: <a href="https://www.ftc.gov/news-events/news/press-releases/2011/09/reebok-pay-25-million-customer-refunds-settle-ftc-charges-deceptive-advertising-easytone-runtone" target="_blank" rel="noopener">Reebok, $25M (FTC, 2011)</a>; <a href="https://www.ftc.gov/news-events/news/press-releases/2012/05/skechers-will-pay-40-million-settle-ftc-charges-it-deceived-consumers-ads-toning-shoes" target="_blank" rel="noopener">Skechers, $40M (FTC, 2012)</a>.</li>
        <li>The claims register itself: the FTC says advertisers should give their network "a list of the health claims they can make" and monitor them (Endorsement Guides FAQ). All four FTC and eCFR pages accessed 22 Sep 2026.</li>
      </ul>
    </aside>
  </div>`;
}
function runTest(){
  const text = document.getElementById("testText").value;
  const r = checkDraft(text);
  const cls = { green:"g", amber:"a", red:"r" }[r.lane];
  const verdict = r.lane === "green" ? "Cleared. Would publish tomorrow." : r.lane === "amber" ? "To the editor. Decision within 24 hours." : "To legal. Logged.";
  document.getElementById("testOut").innerHTML = `<div class="verdict"><div class="lane ${cls}">${r.lane}</div><div class="small muted">${verdict}</div>
    <pre class="copy">${markUp(text, r.hits)}</pre>${marksList(r.hits)}</div>`;
}

function bench(){
  const busy = new Set(state.pieces.filter(p => ["assigned","amber","legal"].includes(p.status)).map(p => p.creatorId));
  const list = creatorList();
  const notes = [];
  const rows = list.map(c => {
    const done = state.pieces.filter(p => p.creatorId === c.id && p.liveDay).length;
    const est = estimateRates(c), idx = reachIndex(c);
    let flagRef = "";
    if (c.flags && c.flags.length) { notes.push({ name: c.name, flags: c.flags }); flagRef = ` <sup><a href="#benchnotes" onclick="document.getElementById('benchnotes').scrollIntoView();return false;" title="${esc(c.flags.join(" "))}">${notes.length}</a></sup>`; }
    return `<tr><td><b><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.name)}</a></b>${flagRef}<div class="meta">${esc(c.handle)}</div></td><td>${DATA.beats[c.beat] || esc(c.beat)}</td><td class="num">${esc(c.subscribersText || fmt(c.subscribers)).replace(" subscribers", "")}${c.subscribersStale ? ` <span class="stale">stale</span>` : ""}</td><td class="num">${fmt(c.medianViews15)}${c.feedStale ? ` <span class="stale">stale</span>` : ""}</td><td class="num">${fmt(c.uploads30d)}${c.uploads30dIsFloor ? "+" : ""}${c.shortsInLast15 ? `<div class="meta">${c.shortsInLast15}/15 Shorts</div>` : ""}</td><td class="num">${idx == null ? "–" : idx.toFixed(2)}</td><td class="num">${est ? `${money(est.integration)} / ${money(est.short)}` : "–"}</td><td>${busy.has(c.id) ? stamp("amber", "On a piece") : stamp("green", "Available")}${done ? ` ${stamp("grey", done + " live")}` : ""}</td></tr>`;
  }).join("");
  const cap = LIVE.creators && LIVE.creators[0] ? (LIVE.creators[0].subscribersCapturedAt || LIVE.generatedAt) : LIVE.generatedAt;
  return `<div class="kicker">Section D</div>
  <h2 class="headline">The bench</h2>
  <p class="dek">Sixteen correspondents on a quarterly retainer, two per beat, chosen once and contracted once. When the desk commissions, the brief goes to the available correspondent on that beat with the higher median views.</p>
  <div class="tablewrap"><table class="ledger"><tr><th>Correspondent</th><th>Beat</th><th class="num">Subscribers (YouTube)</th><th class="num">Median views, last 15 uploads (RSS)</th><th class="num">Uploads, 30 days</th><th class="num">Reach index</th><th class="num">Rate card · integration / Short</th><th>Status</th></tr>${rows}</table></div>
  <p class="srcline" style="margin-top:8px">Counts captured ${fmtDate(cap)}${DATA_MODE === "live" ? " from the daily data file" : " (embedded snapshot)"}. Subscriber counts are YouTube's rounded public figures. Views are the feed's public count; since 24 Aug 2026 YouTube counts a view from the first frame.</p>
  ${notes.length ? `<div id="benchnotes" style="margin-top:22px"><p class="sub">Notes the desk must clear before contracting</p><ol class="marks">${notes.map((n, i) => `<li><sup style="color:var(--mute)">${i + 1}</sup><span><b>${esc(n.name)}</b>. ${esc(n.flags.join(" "))}</span></li>`).join("")}</ol></div>` : ""}
  <div class="cols" style="margin-top:28px">
    <div>
      <p class="sub">Rate card · how it is calculated</p>
      <p class="small">Median views of the last 15 uploads × 0.52 (the engaged share of public views in Fitness since YouTube's 24 Aug 2026 counting change) = engaged views. Engaged views ÷ 1,000 × the CPM for the tier: $51 under 50k views, $28 from 50k to 300k, $22 above. A Short is priced at half the integration. Figures are calculated, not quoted. Three caveats: for a channel whose last 15 uploads are all Shorts (the table shows the count) the integration price is derived from Shorts views; the 0.52 share describes views counted since 24 Aug 2026 but is applied to all 15 uploads, so a feed with older uploads is understated; and "a Short is half the integration" rests on one finance-sector benchmark, so it is low confidence.</p>
      <p class="srcline">Sources: <a href="https://static.agentio.com/blog/2026-YouTube-Creator-Marketing-Playbook.pdf" target="_blank" rel="noopener">Agentio 2026 Playbook</a> (CPM by tier, 10,000+ integrations); <a href="https://creatorsagency.co/blog/youtube-sponsorship-rate-card-2026" target="_blank" rel="noopener">Creators Agency rate card 2026</a> (fee = views ÷ 1,000 × CPM; usage +20% per 30 days); <a href="https://www.agentio.com/blog/youtube-new-view-count-60-engaged-view-rate" target="_blank" rel="noopener">Agentio, 3 Sep 2026</a> (52% engaged-view rate, Fitness). Accessed 22 Sep 2026.</p>
      <p class="sub" style="margin-top:22px">Reach index · what it means</p>
      <p class="small">Median views per subscriber, indexed so that the bench median is 1.00. A channel at 2.00 gets twice the views per subscriber of the typical correspondent here. It is recomputed every time the data refreshes, and it only ranks these sixteen against each other.</p>
    </div>
    <aside class="side">
      <p class="sub">Contracted once, refreshed each quarter</p>
      <p>One agreement per correspondent: a monthly minimum, the rate card above, and pre-priced options for an extra video, a usage extension and Boost rights. An extra wave is a notice, not a renegotiation. The draft term is ${DATA.desk.draftDays} days for everyone. Correspondents whose pieces move the numbers stay; the bench is rebalanced by beat.</p>
      <p class="sub" style="margin-top:22px">Onboarded to the standards</p>
      <p>Every correspondent receives the style guide and claims register at signing, so drafts arrive closer to clearable. The amber rate is a bench-quality metric too.</p>
    </aside>
  </div>`;
}

function dashboard(){
  const live = state.pieces.filter(p => p.liveDay && cardById(p.trendId) && creatorById(p.creatorId));
  const ttl = live.map(p => p.liveDay - cardById(p.trendId).appears);
  const ctl = live.map(p => p.liveDay - p.commissionedDay);
  const avg = a => a.length ? (a.reduce((x,y) => x+y, 0) / a.length) : null;
  const avgTtl = avg(ttl), avgCtl = avg(ctl);
  const boosted = state.pieces.filter(p => p.boosted).length;
  const withRead = state.pieces.filter(p => p.metrics);
  const views = withRead.reduce((s,p) => s + p.metrics.views, 0);
  const old = DATA.facts.oldDays, oldPost = oldPostDiscovery();
  const scale = 40; // days across the ruler
  const w = d => d ? Math.min(100, Math.max(2, d / scale * 100)) : 0;
  const stages = DATA.facts.oldStages.map(([n, d]) => `${n} ${d}`).join(" · ");
  const postStages = DATA.facts.oldStages.slice(2).map(([n, d]) => `${n.toLowerCase()} ${d}`).join(", ");
  const capped = state.amberUsed >= DATA.desk.amberAllowance;
  const rows = live.sort((a,b) => a.liveDay - b.liveDay).map(p => { const t = cardById(p.trendId), c = creatorById(p.creatorId); return `<tr><td>${esc(t.title)}</td><td>${esc(c.name)}</td><td class="num">${t.appears}</td><td class="num">${p.commissionedDay}</td><td class="num">${p.liveDay}</td><td class="num"><b>${p.liveDay - t.appears}</b></td><td class="num">${p.liveDay - p.commissionedDay}</td><td>${p.check ? stamp(p.check.lane, p.check.lane) : ""}</td><td class="num">${p.metrics ? fmt(p.metrics.views) : "<span class='muted'>pending</span>"}${p.metrics && p.metrics.boostViews ? `<div class="meta">after boost ${fmt(p.metrics.boostViews)}</div>` : p.boosted ? " ·B" : ""}</td></tr>`; }).join("");
  const f = DATA.facts;
  const cal = DATA.calendar.map(x => `<li><b>${fmtDay(x.d + "T12:00:00Z")}</b> · <a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.e)}</a></li>`).join("");
  return `<div class="kicker">Section E</div>
  <h2 class="headline">Dashboard</h2>
  <p class="dek">The number the desk is held to is trend-to-live: days from a trend appearing on the board to a correspondent's video being up. The pilot target is ${DATA.desk.pilotTargetDays} days. Today's process is shown alongside, like for like.</p>
  <div class="stats">
    <div class="stat"><div class="n">${avgTtl === null ? "–" : avgTtl.toFixed(1)}</div><div class="l">Average trend-to-live, days${avgTtl === null ? " (no piece live yet)" : ""}. Pilot target ${DATA.desk.pilotTargetDays}. Illustrative today: ${old} days from brief to live.</div></div>
    <div class="stat"><div class="n">${avgCtl === null ? "–" : avgCtl.toFixed(1)}</div><div class="l">Average commission-to-live, days. Like for like today: about ${oldPost} days after discovery on the illustrative timeline; 2 to 6 weeks first contact to live (Creators Agency, 2026).</div></div>
    <div class="stat"><div class="n">${live.length}</div><div class="l">Pieces live, ${boosted} boosted</div></div>
    <div class="stat"><div class="n${capped ? " alert" : ""}">${state.amberUsed}<small> / ${DATA.desk.amberAllowance}</small></div><div class="l">Amber decisions used this month${capped ? "; allowance used, further ambers go to legal" : ""}</div></div>
    <div class="stat"><div class="n">${state.redLogged}</div><div class="l">Pieces sent to legal and logged</div></div>
    <div class="stat"><div class="n">${views ? fmt(views) : "–"}</div><div class="l">48-hour views across pieces with a read, before any boost</div></div>
  </div>
  <div style="margin-top:30px">
    <p class="sub">Today's process against this desk · ruler in 5-day marks</p>
    <div class="rowlabel"><span>Illustrative today, brief to live (team estimate: ${stages})</span><b>${old} days</b></div>
    <div class="track"><i style="width:${w(old)}%"></i></div>
    <div class="rowlabel"><span>Pilot target, trend-to-live</span><b>${DATA.desk.pilotTargetDays} days</b></div>
    <div class="track"><i class="green" style="width:${w(DATA.desk.pilotTargetDays)}%"></i></div>
    <div class="rowlabel"><span>This desk, trend-to-live so far</span><b>${avgTtl === null ? "no piece live yet" : avgTtl.toFixed(1) + " days"}</b></div>
    <div class="track"><i class="red" style="width:${w(avgTtl)}%"></i></div>
    <div class="rowlabel" style="margin-top:22px"><span>Like for like on commission-to-live · today, the stages after discovery (${postStages})</span><b>${oldPost} days</b></div>
    <div class="track"><i style="width:${w(oldPost)}%"></i></div>
    <div class="rowlabel"><span>This desk, commission-to-live so far</span><b>${avgCtl === null ? "no piece live yet" : avgCtl.toFixed(1) + " days"}</b></div>
    <div class="track"><i class="blue" style="width:${w(avgCtl)}%"></i></div>
    <div class="ruler"></div>
    <p class="note">${esc(f.oldNote)} Published figure: ${esc(f.timeline.text)} <a href="${f.timeline.url}" target="_blank" rel="noopener">${esc(f.timeline.source)}</a>${f.timeline.url2 ? `; <a href="${f.timeline.url2}" target="_blank" rel="noopener">${esc(f.timeline.url2label || "second source")}</a>` : ""}. Both accessed 22 and 23 Sep 2026.</p>
  </div>
  <div class="stats" style="margin-top:30px">
    <div class="stat"><div class="n">${f.brief15x.n}</div><div class="l">${esc(f.brief15x.text)}<div class="meta" style="margin-top:6px">${esc(f.brief15x.source)}</div></div></div>
    <div class="stat"><div class="n">${f.brief15pct.n}</div><div class="l">${esc(f.brief15pct.text)}<div class="meta" style="margin-top:6px">${esc(f.brief15pct.source)}</div></div></div>
    <div class="stat"><div class="n">${f.iab.n}</div><div class="l">${esc(f.iab.text)}<div class="meta" style="margin-top:6px"><a href="${f.iab.url}" target="_blank" rel="noopener">${esc(f.iab.source)}</a></div></div></div>
  </div>
  <div style="margin-top:30px">
    <p class="sub">Pieces live</p>
    ${rows ? `<div class="tablewrap"><table class="ledger"><tr><th>Piece</th><th>Correspondent</th><th class="num">Trend seen</th><th class="num">Commissioned</th><th class="num">Live</th><th class="num">Trend-to-live</th><th class="num">Commission-to-live</th><th>First read</th><th class="num">48h views (sim.)</th></tr>${rows}</table></div>` : `<div class="empty">Nothing live yet. Commission a piece and advance the day a few times.</div>`}
  </div>
  <div class="cols" style="margin-top:34px">
    <div>
      <p class="sub">The next eight weeks · two or three waves, not one drop</p>
      <div class="waves">
        <div class="wave"><div class="w">Wave 1 · weeks 1 to 2</div><div class="when">2 to 15 Nov</div><p class="small">A small cohort publishes around the Indianapolis Monumental (7 Nov, the one race where Brooks is a sponsor). The analyst has a first read within 48 hours of each piece, and the first reallocation decision is taken on day three of the wave.</p></div>
        <div class="wave"><div class="w">Wave 2 · weeks 3 to 5</div><div class="when">16 Nov to 6 Dec</div><p class="small">Commission more of what moved: turkey trots (26 Nov), the Black Friday window (27 Nov), JFK 50 and Philadelphia (21 and 22 Nov), CIM (6 Dec). The correspondents whose pieces performed get the next briefs.</p></div>
        <div class="wave"><div class="w">Wave 3 · weeks 6 to 8</div><div class="when">7 to 27 Dec</div><p class="small">Boost the winners through Creator partnerships boost into the gift and new-year window. Media spend only follows pieces that have already proved themselves.</p></div>
      </div>
      <p class="note">In the 90-day pilot the deck proposes (days 1 to 30 set the standards and sign the bench; days 31 to 75 run the desk; days 76 to 90 read and scale), this simulation is the middle stretch.</p>
    </div>
    <aside class="side">
      <p class="sub">Deal terms, negotiated once</p>
      <ul class="tight small">
        <li><b>One quarterly agreement</b> per correspondent: a monthly minimum and the rate card on the bench page.</li>
        <li><b>Pre-priced options</b> for an extra video, a usage extension and Boost rights, so an extra wave is a notice, not a renegotiation. Published benchmarks price usage rights at about 20% of the base fee per 30 days and exclusivity at about 10% (Creators Agency, 2026).</li>
        <li><b>No exclusivity for the gear beat.</b> Shoe reviewers cover competitors by definition; the agreement says so.</li>
        <li><b>A kill fee</b> and a 24-hour amber decision window, so a piece is never left waiting on the brand.</li>
      </ul>
      <p class="sub" style="margin-top:22px">The calendar the waves sit on</p>
      <ul class="tight small">${cal}</ul>
      <p class="note">Dates read from the official race sites on 22 Sep 2026. Footwear partners checked 23 Sep 2026: Brooks is a presenting sponsor of the Indianapolis Monumental (official footwear and apparel sponsor under a three-year deal announced Oct 2022); JFK 50 lists Altra; no footwear partner was found on the Philadelphia and CIM pages read; Manchester and Dallas were not checked. Everywhere but Indianapolis the desk covers the moment, not the event.</p>
    </aside>
  </div>
  <p class="note" style="margin-top:40px;border-top:1px solid var(--rule);padding-top:14px">A prototype built for the NYU SPS × Google Marketing Accelerator Hackathon, Track 3. Not a Google product. Brooks Running is a real brand used as the worked example and is not involved; the bench is sixteen real public YouTube channels, none of them contacted, and nothing here is attributed to them. Signals are real and link to their sources; assignments and results are simulated. <a href="#about" onclick="go('about');return false;">What is real, what is calculated, what is simulated</a> · <a href="https://github.com/Lauwoes/creator-newsroom" target="_blank" rel="noopener">Source on GitHub</a>.</p>`;
}

function about(){
  const srcs = (LIVE.sources || []).map(s => `<li><b>${esc(s.name)}</b>: ${esc(s.status)}${s.ok != null ? ` (${s.ok} ok, ${s.failed || 0} failed)` : ""}, last success ${fmtDate(s.lastSuccess)}. <span class="muted">${esc(s.note || "")}</span></li>`).join("");
  const prod = DATA.products.map(([stage, real, url, here, url2, url2label]) => `<dt>${stage}</dt><dd>${esc(real)} <a href="${esc(url)}" target="_blank" rel="noopener">source</a>${url2 ? `, <a href="${esc(url2)}" target="_blank" rel="noopener">${esc(url2label || "second source")}</a>` : ""}<div class="meta" style="margin-top:4px">${esc(here)}</div></dd>`).join("");
  const age = fileAgeHours();
  return `<div class="kicker">Colophon</div>
  <h2 class="headline">What is real, what is modelled, what is simulated</h2>
  <p class="dek">This site was built for the NYU SPS and Google Marketing Accelerator Hackathon, Track 3, as the functional prototype behind the Creator Newsroom submission. It is a student prototype and a process demonstration on real data, not a product and not a Google product.</p>
  <div class="cols">
    <div>
      <p class="sub">Real</p>
      <ul class="tight small">
        <li><b>The brand and products.</b> ${esc(DATA.brand.name)}, the ${esc(DATA.brand.short)} ($${DATA.brand.price}, ${esc(DATA.brand.widths)}), the ${esc(DATA.brand.racer)} and the ${esc(DATA.brand.trail)}, read from <a href="${DATA.brand.productUrl}" target="_blank" rel="noopener">brooksrunning.com</a> on ${DATA.brand.verified}. ${esc(DATA.brand.note)}</li>
        <li><b>The sixteen channels</b> on the bench, their handles, subscriber counts and the views of their last 15 uploads (YouTube's public feed and channel pages).</li>
        <li><b>Every signal on the trend board</b>: Google Trends US search interest, English Wikipedia pageviews and YouTube feed views, each linked to its source with the time it was captured. Google Trends rescales every pull to a 0 to 100 index, so its sums and change figures vary between refreshes and its day boundary is Google's own; treat them as direction, not counts.</li>
        <li><b>The race dates</b> and sponsors, from the official race sites; <b>the review findings</b> on the Ghost 18 fit; <b>the FTC rules</b> and footwear cases behind the standards; <b>the Google product names</b>, checked on Google's own pages.</li>
        <li><b>The figures in the brief</b> (1.5×, 15%) are quoted from the hackathon brief; no public source was found for them. The IAB 4× figure is sourced.</li>
      </ul>
      <p class="sub" style="margin-top:22px">Modelled, formula shown</p>
      <ul class="tight small">
        <li><b>Rate card</b>: median views × 0.52 engaged share ÷ 1,000 × a published CPM tier ($51 / $28 / $22). Short = half. Not any creator's rate.</li>
        <li><b>Reach index</b>: views per subscriber, bench median = 1.00.</li>
        <li><b>Momentum</b>: 50 + week-on-week change ÷ 2 for search and pageview signals; 50 + 20 × log10(views ÷ 10,000) for YouTube view totals; a signal with no change figure counts as neutral (50). Minus the card's decay for each day it is not covered.</li>
        <li><b>Today's process</b>: the ${DATA.facts.oldDays}-day split is the team's illustrative timeline; the published range is 2 to 6 weeks from first contact to live (Creators Agency, 2026, finance-sector deal data).</li>
      </ul>
      <p class="sub" style="margin-top:22px">Simulated</p>
      <ul class="tight small">
        <li><b>The day-by-day reveal and decay</b> of trends, the ${DATA.desk.draftDays}-day draft term, the ${DATA.desk.legalTurnaround}-day legal turnaround, the amber allowance of ${DATA.desk.amberAllowance}.</li>
        <li><b>Every assignment, brief, draft and outcome.</b> No correspondent was contacted. The draft scripts are the desk's test scripts and are not written or said by anyone on the bench. The trend-card angles are editor's notes written on ${esc(DATA.boardDate)}.</li>
        <li><b>The 48-hour read</b>: a projection from the channel's real median views (formula in the code), and the boost, an arbitrary ×3.2 multiplier: no published benchmark was found for Boost uplift in 48 hours, none gives the share of views arriving in 48 hours, and Brand Lift needs a 10-day study, so no brand-lift number is shown.</li>
      </ul>
    </div>
    <aside class="side">
      <p class="sub">Where Google products sit in the pilot desk</p>
      <dl class="kv">${prod}</dl>
      <p class="note">Names as Google uses them in autumn 2026: YouTube Creator Partnerships (formerly BrandConnect, announced 23 Mar 2026), Creator partnerships boost, the brand pulse report (launched 9 Oct 2025), Insights Finder, Gemini, Gemini Notebook (NotebookLM was renamed on 16 Jul 2026). Insights Finder needs a Google account representative and its outputs are confidential, which is one reason the prototype uses public stand-ins. Naming a product here describes what the pilot would use; nothing on this site is integrated with, endorsed by or affiliated with Google.</p>
      <p class="sub" style="margin-top:22px">How the data refreshes</p>
      <p class="small">A GitHub Action runs <code>scripts/fetch_data.py</code> once a day and commits <code>data/live.json</code> and, with the snapshot re-embedded, <code>app.js</code>. The script uses no API key: YouTube channel feeds and channel pages, the Wikimedia pageviews API and Google Trends' web endpoints. When a source fails, the last good value is kept and marked stale; nothing is estimated or invented. This page loads the file when it opens, falls back to the snapshot embedded in the page, and then refreshes the Wikipedia figures directly in your browser. The folio line reads "daily file" when the file loaded, "not refreshed since" when it is more than ${FILE_OLD_AFTER_H} hours old, and "snapshot" when it fell back to the embedded copy.</p>
      <ul class="tight small">${srcs || "<li>No source summary in the data file.</li>"}</ul>
      <p class="srcline">Data file generated ${fmtDate(LIVE.generatedAt)}${age != null && age > FILE_OLD_AFTER_H ? ` (more than ${FILE_OLD_AFTER_H} hours old: the daily refresh has not run or has failed)` : ""}. Mode now: ${DATA_MODE === "live" ? "daily file" : "embedded snapshot"}.</p>
    </aside>
  </div>`;
}

/* ===================== BOOT ===================== */
(function boot(){
  load();
  const h = (location.hash || "").replace("#", "");
  const [s, mode] = h.split("/");
  if (SCREENS.includes(s)) screen = s;
  if (mode === "demo") document.body.classList.add("demo");
  try { render(); }
  catch (e) { console.error("saved state could not be rendered; resetting", e); state = freshState(); save(); STATE_RESET_NOTE = "Saved progress could not be read and was reset."; render(); }
  if (STATE_RESET_NOTE) setTimeout(() => toast(STATE_RESET_NOTE), 300);
  window.addEventListener("hashchange", () => { const [s2, m2] = (location.hash || "").replace("#", "").split("/"); if (SCREENS.includes(s2)) { document.body.classList.toggle("demo", m2 === "demo"); go(s2, true); } });
  loadLive();
})();
