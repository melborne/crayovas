require 'sinatra'
require 'haml'
require "sass"
require_relative 'lib/crayola'

configure do
  APP_TITLE = "Crayovas"
end

get '/' do
  cr = Crayola::Crayola
  @series_names = cr.series
  @colors_in_series = {}
  @series_names.each do |se|
    colors = cr.colors_in_series(se)
               .map { |c| c.notes = c.hex =~ /#[0-7]/ ? "#D0FFD0" : "#424242"; c }
    @colors_in_series[se] = colors
  end

  haml :index
end

before do
  
end

get '/style.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :style
end