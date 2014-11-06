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
      set :fake_db, File.open( "data/things.json", "r" ) { |f| JSON.load( f )}

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

    post '/parse_timestring' do
      content_type :json
      p = MuseumProvenance::Period.new("test ")
      p.parse_time_string(params[:str])      
      hash = {}
      hash[:eotb] = p.eotb ? p.eotb.to_time.to_i : nil    
      hash[:eote] = p.eote ? p.eote.to_time.to_i : nil   
      hash[:botb] = p.botb ? p.botb.to_time.to_i : nil
      hash[:bote] = p.bote ? p.bote.to_time.to_i : nil      
      hash[:eotb_precision] = p.beginning.latest_raw.precision rescue nil
      hash[:eote_precision] = p.ending.latest_raw.precision rescue nil
      hash[:botb_precision] = p.beginning.earliest_raw.precision rescue nil 
      hash[:bote_precision] = p.ending.earliest_raw.precision  rescue nil
      hash.to_json
    end

    post '/add_party' do
      content_type :json
      data = params[:period].collect do |key,val| 
        symbolize_keys(val)
      end
      results = MuseumProvenance::Provenance.from_json({period: data})
      results.insert_earliest(MuseumProvenance::Period.new(""));
      
      vals = JSON.parse(results.to_json)
      vals["period"] = vals["period"].collect.with_index do |r,i|
        if i == 0
          r[:id] = data[0][:id] + "-" + results.count.to_s
        else
          r[:id] = data[i-1][:id]
        end
        r 
      end
      vals.to_json
    end

    post '/rebuild_structure' do
      content_type :json
      data = params[:period].collect do |key,val| 
        symbolize_keys(val)
      end
      results = MuseumProvenance::Provenance.from_json({period: data}).to_json
      vals = JSON.parse(results)
      vals["period"] = vals["period"].collect.with_index do |r,i|
        puts "#{r['party']} - #{r['direct_transfer']}"
        r[:id] = data[i][:id];
        r
      end
      vals.to_json
    end

    post '/get_structure' do
      content_type :json
      p = params[:provenance]
      MuseumProvenance::Provenance.extract(p).to_json
    end
  end
end