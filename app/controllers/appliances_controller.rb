class AppliancesController < ApplicationController
  def index
    @appliances = Appliance.all
  end
end
