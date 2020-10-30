DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_toke_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text,
  "path" text
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text,
  "created_at" timestamp DEFAULT now(),
  "file_id" int
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "chef_id" int,
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "user_id" int NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "recipe_id" int,
  "file_id" int
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "recipes"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();