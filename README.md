Elysa
===============

CMOA Provenance entry tool


### Installing ElasticSearch.

  brew install elasticsearch

  Data:    /usr/local/var/elasticsearch/elasticsearch_david/
  Logs:    /usr/local/var/log/elasticsearch/elasticsearch_david.log
  Plugins: /usr/local/var/lib/elasticsearch/plugins/

  ElasticSearch requires Java 7; you will need to install an appropriate JDK.

  To have launchd start elasticsearch at login:
      ln -sfv /usr/local/opt/elasticsearch/*.plist ~/Library/LaunchAgents
  Then to load elasticsearch now:
      launchctl load ~/Library/LaunchAgents/homebrew.mxcl.elasticsearch.plist
  Or, if you don't want/need launchctl, you can just run:
      elasticsearch --config=/usr/local/opt/elasticsearch/config/elasticsearch.yml

### Installing Marvel

  cd /usr/local/var/lib/elasticsearch/plugins/
  ./bin/plugin -i elasticsearch/marvel/latest
  cd $CMOA_ROOT/provenance_tool
  echo 'marvel.agent.enabled: false' >> ./elasticsearch.yml
  