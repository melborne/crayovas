autoload :YAML, 'yaml'

module Crayola
  CURRENT_DIR = File.expand_path(File.dirname(__FILE__))
  require_relative 'crayola/scraper'
  require_relative 'crayola/color'
  class Crayola
    class << self
      attr_reader :series, :colors
      def init
        crayola = load_build_file || Scraper.build
        @series = crayola.keys
        @colors = build_colors(crayola)
      end

      def color(name)
        @colors.detect { |c| c.name == name }
      end

      def colors_in_series(series)
        @colors.select { |c| c.series == series }
      end

      def color_names
        @colors.map(&:name)
      end

      def build_colors(crayola)
        tmp = []
        crayola.each do |series, colors|
          colors.each { |attrs| tmp << Color.new(series, *attrs) }
        end
        tmp
      end

      def load_build_file(io=CURRENT_DIR+'/crayola/crayola.yml')
        YAML.load_file(io)
      rescue
        nil
      end
    end

    init
  end
end
