class CreateManuals < ActiveRecord::Migration[6.1]
  def change
    create_table :manuals, comment: '説明書' do |t|
      t.references :appliance, foreign_key: true, null: false, comment: '機器ID'
      t.string :name, null: false, comment: '名称'
      t.string :model_number, comment: '型番'
      t.string :created_by, null: false,  comment: '作成者'
      t.string :updated_by, null: false,  comment: '更新者'
      t.datetime :created_at, null: false,  comment: '作成日'
      t.datetime :updated_at, null: false,  comment: '更新日'
    end
  end
end
