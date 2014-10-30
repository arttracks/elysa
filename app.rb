require "sinatra/base"
#require 'sinatra/handlebars'
require 'haml'
require "tilt"
require 'sass'
require 'json'
require 'museum_provenance'

$stdout.sync = true # for foreman logging

module CMOA
  class App < Sinatra::Base
    #  register Sinatra::Handlebars

    # handlebars {
    #   templates '/js/templates.js', ['views/templates/*']
    # }

    configure do
      set :fake_db, File.open( "data/lil_things.json", "r" ) { |f| JSON.load( f )}

    end

    helpers do
      def symbolize_keys(hash)
        hash.inject({}){|result, (key, value)|
          new_key = case key
                    when String then key.to_sym
                    else key
                    end
          new_value = case value
                      when Hash then symbolize_keys(value)
                      else value
                      end
          result[new_key] = new_value
          result
        }
      end
    end

    get '/' do
      haml :index
    end

    get '/artworkLists' do
      content_type :json

      artworks = settings.fake_db["table"]["record"].collect do |record|
        {id: record["irn"], title: record["TitMainTitle"]}
      end
      return { artwork_list: artworks}.to_json
    end

    delete '/periods/:id' do
      content_type :json
      {}.to_json
    end

    get '/artworks/:id' do
      content_type :json
      record = settings.fake_db["table"]["record"].find{|record| record["irn"] == params[:id]}
      return nil if record.nil?
     
      return {artwork: {
        id: params[:id],
        artist: record["CreCreatorRef_tab"]["tuple"]["NamFullName"],
        title: record["TitMainTitle"],
        creationDateEarliest: Date.new(record["CreEarliestDate"].to_i),
        creationDateLatest: Date.new(record["CreLatestDate"].to_i),
        provenance: record["CreProvenance"]
      }}.to_json
    end

    post '/rebuild_structure' do
      content_type :json
      data = params[:period].collect do |key,val| 
        symbolize_keys(val)
      end
      results = MuseumProvenance::Provenance.from_json({period: data}).to_json
      vals = JSON.parse(results)
      vals["period"] = vals["period"].collect.with_index{|r,i| r[:id] = data[i][:id]; r }
      vals.to_json
    end

    post '/get_structure' do
      content_type :json
      p = params[:provenance]
      MuseumProvenance::Provenance.extract(p).to_json
    end
  end
end