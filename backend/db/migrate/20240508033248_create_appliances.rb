class CreateAppliances < ActiveRecord::Migration[6.1]
  def change
    create_table :appliances, comment: '機器' do |t|
      t.string :name, null: false, comment: '名称'
      t.string :model_number, comment: '型番'
      t.date :purchased_date,  comment: '購入日'
      t.date :disposed_date,  comment: '破棄日'
      t.string :created_by, null: false,  comment: '作成者'
      t.string :updated_by, null: false,  comment: '更新者'
      t.datetime :created_at, null: false,  comment: '作成日'
      t.datetime :updated_at, null: false,  comment: '更新日'
    end
  end
end
