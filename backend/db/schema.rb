# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_12_21_000000) do
  create_table "appliances", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "機器", force: :cascade do |t|
    t.string "name", null: false, comment: "名称"
    t.string "model_number", comment: "型番"
    t.date "purchased_date", comment: "購入日"
    t.date "disposed_date", comment: "破棄日"
    t.string "created_by", null: false, comment: "作成者"
    t.string "updated_by", null: false, comment: "更新者"
    t.datetime "created_at", precision: nil, null: false, comment: "作成日"
    t.datetime "updated_at", precision: nil, null: false, comment: "更新日"
    t.integer "price", comment: "参考価格"
    t.text "memo", comment: "メモ"
  end

  create_table "manuals", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "説明書", force: :cascade do |t|
    t.bigint "appliance_id", null: false, comment: "機器ID"
    t.string "name", null: false, comment: "名称"
    t.string "model_number", comment: "型番"
    t.string "created_by", null: false, comment: "作成者"
    t.string "updated_by", null: false, comment: "更新者"
    t.datetime "created_at", precision: nil, null: false, comment: "作成日"
    t.datetime "updated_at", precision: nil, null: false, comment: "更新日"
    t.index ["appliance_id"], name: "index_manuals_on_appliance_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "ユーザー", force: :cascade do |t|
    t.string "name", null: false, comment: "名前"
    t.integer "privilege", null: false, comment: "権限"
    t.string "created_by", null: false, comment: "作成者"
    t.string "updated_by", null: false, comment: "更新者"
    t.datetime "created_at", precision: nil, null: false, comment: "作成日"
    t.datetime "updated_at", precision: nil, null: false, comment: "更新日"
  end

  add_foreign_key "manuals", "appliances"
end
