class AddPriceAndMemoToAppliances < ActiveRecord::Migration[7.1]
  def change
    add_column :appliances, :price, :integer, comment: '参考価格'
    add_column :appliances, :memo, :text, comment: 'メモ'
  end
end
