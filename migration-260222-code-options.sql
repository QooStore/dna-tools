-- migration-260222-code-options.sql
-- Selectbox 옵션 DB 이관: SKILL_TYPE, PASSIVE_UPGRADE_TYPE, RARITY

-- SKILL_TYPE
INSERT INTO common_codes VALUES ('SKILL_TYPE','damage'),('SKILL_TYPE','buff'),('SKILL_TYPE','passive'),('SKILL_TYPE','heal'),('SKILL_TYPE','summon'),('SKILL_TYPE','defense');
INSERT INTO common_code_labels VALUES ('SKILL_TYPE','damage','대미지'),('SKILL_TYPE','buff','버프'),('SKILL_TYPE','passive','패시브'),('SKILL_TYPE','heal','치료'),('SKILL_TYPE','summon','소환'),('SKILL_TYPE','defense','방어');

-- PASSIVE_UPGRADE_TYPE
INSERT INTO common_codes VALUES ('PASSIVE_UPGRADE_TYPE','STAT'),('PASSIVE_UPGRADE_TYPE','ABILITY'),('PASSIVE_UPGRADE_TYPE','COOP');
INSERT INTO common_code_labels VALUES ('PASSIVE_UPGRADE_TYPE','STAT','스탯 강화'),('PASSIVE_UPGRADE_TYPE','ABILITY','능력'),('PASSIVE_UPGRADE_TYPE','COOP','협력 동료');

-- RARITY
INSERT INTO common_codes VALUES ('RARITY','2'),('RARITY','3'),('RARITY','4'),('RARITY','5');
INSERT INTO common_code_labels VALUES ('RARITY','2','★2'),('RARITY','3','★3'),('RARITY','4','★4'),('RARITY','5','★5');
