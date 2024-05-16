class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users, comment: 'ユーザー' do |t|
      t.string :name, null: false, comment: '名前'
      t.integer :privilege, null: false, comment: '権限'
      t.string :created_by, null: false,  comment: '作成者'
      t.string :updated_by, null: false,  comment: '更新者'
      t.datetime :created_at, null: false,  comment: '作成日'
      t.datetime :updated_at, null: false,  comment: '更新日'
    end
  end
end
