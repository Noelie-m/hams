class HomeController < ApplicationController
  def index
    @appliances = Appliance.all
  end
end
