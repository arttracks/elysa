source 'https://rubygems.org'

gem "sinatra", "~>1.4"
gem "haml", "~>4.0"
gem "coffee-script"
gem "sass"
gem "thin", "~>1.6"
gem "tilt", "~>1.4"
gem "sinatra-contrib"
gem "bootstrap-sass"
#gem "sinatra-handlebars"
gem "rerun"
gem "rb-fsevent"

gem 'date_time_precision', "~>1.8"
gem 'museum_provenance', :path => "../museum_provenance"

group :documentation do
  gem 'rack-jekyll', :git => 'https://github.com/adaoraul/rack-jekyll.git'
end

group :development do
  gem 'guard'
  gem 'guard-sass'
  gem 'guard-livereload'
  gem "rack-livereload"
  gem 'guard-bundler', require: false
  gem 'guard-shell'
  gem 'guard-coffeescript'
  gem 'minitest'
  gem 'minitest-reporters'
  gem 'rake'
  gem 'uglifier'
  gem 'guard-sprockets'
end
