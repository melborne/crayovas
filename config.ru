require "bundler"
Bundler.require
$LOAD_PATH << File.expand_path(File.dirname(__FILE__))
require 'crayovas'
run Sinatra::Application

