class AppliancesController < ApplicationController
  before_action :set_appliance, only: [:show, :update, :destroy]

  # GET /appliances
  def index
    @appliances = Appliance.all
    render json: @appliances
  end

  # GET /appliances/1
  def show
    render json: @appliance
  end

  # POST /appliances
  def create
    @appliance = Appliance.new(appliance_params)
    @appliance.created_by = 'system' # Temporary
    @appliance.updated_by = 'system' # Temporary

    if @appliance.save
      render json: @appliance, status: :created, location: @appliance
    else
      render json: @appliance.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /appliances/1
  def update
    @appliance.updated_by = 'system' # Temporary
    if @appliance.update(appliance_params)
      render json: @appliance
    else
      render json: @appliance.errors, status: :unprocessable_entity
    end
  end

  # DELETE /appliances/1
  def destroy
    @appliance.destroy
  end

  private
    def set_appliance
      @appliance = Appliance.find(params[:id])
    end

    def appliance_params
      params.require(:appliance).permit(:name, :model_number, :purchased_date, :disposed_date, :price, :memo)
    end
end
