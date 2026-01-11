-- 캐릭터 기본 정보 테이블 --
CREATE TABLE characters (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '캐릭터 PK',
  slug VARCHAR(50) NOT NULL UNIQUE COMMENT '캐릭터 고유 식별자(URL 및 API용)',
  name VARCHAR(50) NOT NULL COMMENT '캐릭터 이름',
  element VARCHAR(10) NOT NULL COMMENT '캐릭터 속성',
  image VARCHAR(255) NOT NULL COMMENT '캐릭터 대표 이미지 경로',
  element_image VARCHAR(255) NOT NULL COMMENT '속성 아이콘 이미지 경로',
  list_image VARCHAR(255) NOT NULL COMMENT '캐릭터 목록 이미지',
  melee_proficiency VARCHAR(20) NOT NULL COMMENT '근접 무기 숙련 타입',
  ranged_proficiency VARCHAR(20) NOT NULL COMMENT '원거리 무기 숙련 타입',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '캐릭터 데이터 생성 일시'
) COMMENT='캐릭터 기본 정보 (루트 테이블)';


-- 특징 --
CREATE TABLE character_features (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '특징 PK',
  character_id BIGINT NOT NULL COMMENT 'characters.id 참조',
  feature VARCHAR(50) NOT NULL COMMENT '캐릭터 특징 태그 (예: 딜러, 서포터)',
  CONSTRAINT fk_feature_character
    FOREIGN KEY (character_id) REFERENCES characters(id)
    ON DELETE CASCADE
) COMMENT='캐릭터 특징 태그 목록';


-- 기본 능력치 --
CREATE TABLE character_stats (
  character_id BIGINT PRIMARY KEY COMMENT 'characters.id (1:1 기본 능력치)',
  attack INT NOT NULL COMMENT '기본 공격력',
  hp INT NOT NULL COMMENT '기본 체력',
  defense INT NOT NULL COMMENT '기본 방어력',
  max_mentality INT NOT NULL COMMENT '최대 정신력',
  resolve DECIMAL(5,2) NOT NULL COMMENT '필사 수치(%)',
  morale DECIMAL(5,2) NOT NULL COMMENT '격양 수치(%)',
  CONSTRAINT fk_stats_character
    FOREIGN KEY (character_id) REFERENCES characters(id)
    ON DELETE CASCADE
) COMMENT='캐릭터 기본 능력치';


-- 동조 무기 --
CREATE TABLE consonance_weapons (
  character_id BIGINT PRIMARY KEY COMMENT 'characters.id (캐릭터 전용 동조 무기)',
  category VARCHAR(10) NOT NULL COMMENT '무기 카테고리 (근접/원거리)',
  weapon_type VARCHAR(20) NOT NULL COMMENT '무기 타입',
  attack_type VARCHAR(10) NOT NULL COMMENT '공격 타입 (베기/관통/진동)',
  attack DECIMAL(6,2) NOT NULL COMMENT '무기 공격력',
  crit_rate DECIMAL(5,2) NOT NULL COMMENT '치명타 확률(%)',
  crit_damage DECIMAL(5,2) NOT NULL COMMENT '치명타 피해량(%)',
  attack_speed DECIMAL(4,2) NOT NULL COMMENT '공격 속도',
  trigger_probability DECIMAL(5,2) NOT NULL COMMENT '발동 확률(%)',
  CONSTRAINT fk_weapon_character
    FOREIGN KEY (character_id) REFERENCES characters(id)
    ON DELETE CASCADE
) COMMENT='캐릭터 전용 동조 무기 정보';


-- 스킬 -- 
CREATE TABLE skills (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '스킬 PK',
  character_id BIGINT NOT NULL COMMENT 'characters.id 참조',
  name VARCHAR(50) NOT NULL COMMENT '스킬 이름',
  type VARCHAR(20) NOT NULL COMMENT '스킬 타입 (대미지/버프/패시브)',
  description TEXT NOT NULL COMMENT '스킬 설명',
  CONSTRAINT fk_skill_character
    FOREIGN KEY (character_id) REFERENCES characters(id)
    ON DELETE CASCADE
) COMMENT='캐릭터 스킬 정보';


-- 패시브 강화 --
CREATE TABLE character_passive_upgrades (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '패시브 업그레이드 PK',
  character_id BIGINT NOT NULL COMMENT 'characters.id 참조',
  upgrade_key VARCHAR(50) NOT NULL COMMENT '업그레이드 고유 키',
  upgrade_type VARCHAR(10) NOT NULL COMMENT '업그레이드 유형 (STAT / ABILITY / COOP)',
  target_stat VARCHAR(30) COMMENT '대상 스탯 (ATK, SKILL_EFFICIENCY 등, STAT 타입일 때만)',
  value DECIMAL(6,2) COMMENT '증가 값(%)',
  name VARCHAR(100) NOT NULL COMMENT '업그레이드 이름 (표시용)',
  description TEXT COMMENT '업그레이드 설명',
  CONSTRAINT uk_character_upgrade
    UNIQUE (character_id, upgrade_key),
  CONSTRAINT fk_passive_upgrade_character
    FOREIGN KEY (character_id)
    REFERENCES characters(id)
    ON DELETE CASCADE
) COMMENT='캐릭터 패시브 강화 업그레이드 항목';



-- 근원 --
CREATE TABLE introns (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '근원 PK',
  character_id BIGINT NOT NULL COMMENT 'characters.id 참조',
  stage INT NOT NULL COMMENT '근원 단계 (1~6)',
  description TEXT NOT NULL COMMENT '근원 단계별 효과 설명',
  CONSTRAINT fk_intron_character
    FOREIGN KEY (character_id) REFERENCES characters(id)
    ON DELETE CASCADE
) COMMENT='캐릭터 근원 단계 정보';


-- 멤버 테이블 --
CREATE TABLE members(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	user_id VARCHAR(50) NOT NULL UNIQUE,
	user_name VARCHAR(50) NOT NULL,
  	password VARCHAR(255) NOT NULL,
  	role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
