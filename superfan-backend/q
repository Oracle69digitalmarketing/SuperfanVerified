                                        Table "public.users"
   Column   |            Type             | Collation | Nullable |              Default              
------------+-----------------------------+-----------+----------+-----------------------------------
 id         | integer                     |           | not null | nextval('users_id_seq'::regclass)
 name       | character varying(100)      |           | not null | 
 email      | character varying(150)      |           |          | 
 created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "idx_users_email" btree (email)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
Referenced by:
    TABLE "content" CONSTRAINT "content_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    TABLE "payments" CONSTRAINT "payments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

