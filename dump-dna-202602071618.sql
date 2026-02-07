-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: dna
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `character_features`
--

DROP TABLE IF EXISTS `character_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `character_features` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '특징 PK',
  `character_id` bigint NOT NULL COMMENT 'characters.id 참조',
  `feature` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '캐릭터 특징 태그 (예: 딜러, 서포터)',
  PRIMARY KEY (`id`),
  KEY `fk_feature_character` (`character_id`),
  CONSTRAINT `fk_feature_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='캐릭터 특징 태그 목록';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `character_features`
--

LOCK TABLES `character_features` WRITE;
/*!40000 ALTER TABLE `character_features` DISABLE KEYS */;
INSERT INTO `character_features` VALUES (1,1,'dps'),(2,1,'weaponDmg'),(3,1,'consonanceWeapon'),(32,7,'dps'),(33,7,'support'),(34,7,'heal'),(37,2,'weaponDmg'),(38,2,'dps');
/*!40000 ALTER TABLE `character_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `character_passive_upgrades`
--

DROP TABLE IF EXISTS `character_passive_upgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `character_passive_upgrades` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '패시브 업그레이드 PK',
  `character_id` bigint NOT NULL COMMENT 'characters.id 참조',
  `upgrade_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '업그레이드 고유 키',
  `upgrade_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '업그레이드 유형 (STAT / ABILITY / COOP)',
  `target_stat` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '대상 스탯 (ATK, SKILL_EFFICIENCY 등, STAT 타입일 때만)',
  `value` decimal(6,2) DEFAULT NULL COMMENT '증가 값(%)',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '업그레이드 이름 (표시용)',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '업그레이드 설명',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_character_upgrade` (`character_id`,`upgrade_key`),
  CONSTRAINT `fk_passive_upgrade_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='캐릭터 패시브 강화 업그레이드 항목';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `character_passive_upgrades`
--

LOCK TABLES `character_passive_upgrades` WRITE;
/*!40000 ALTER TABLE `character_passive_upgrades` DISABLE KEYS */;
INSERT INTO `character_passive_upgrades` VALUES (1,1,'atk_20','STAT','ATK',20.00,'공격','20%'),(2,1,'atk_30','STAT','ATK',30.00,'공격','30%'),(3,1,'skill_efficiency_7_5','STAT','SKILL_EFFICIENCY',7.50,'스킬 효율','7.5%'),(4,1,'skill_efficiency_5','STAT','SKILL_EFFICIENCY',5.00,'스킬 효율','5%'),(5,1,'afterburn','ABILITY','',NULL,'잔불','[어둠의 불꽃] 시전 후 다음 [잔광]을 시전할 때 정신력을 소모하지 않는다.'),(6,1,'heart_devourer','COOP','ATK',40.00,'심장 포식','[협력 동료로 등장할 때에만 적용] 자신과 팀원의 공격력이 상승한다.'),(7,2,'atk_20','STAT','ATK',20.00,'공격','20%'),(10,7,'asdf','STAT','ATK',5.00,'111','1111');
/*!40000 ALTER TABLE `character_passive_upgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `character_stats`
--

DROP TABLE IF EXISTS `character_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `character_stats` (
  `character_id` bigint NOT NULL COMMENT 'characters.id (1:1 기본 능력치)',
  `attack` int NOT NULL COMMENT '기본 공격력',
  `hp` int NOT NULL COMMENT '기본 체력',
  `defense` int NOT NULL COMMENT '기본 방어력',
  `max_mentality` int NOT NULL COMMENT '최대 정신력',
  `resolve` decimal(5,2) NOT NULL COMMENT '필사 수치(%)',
  `morale` decimal(5,2) NOT NULL COMMENT '격양 수치(%)',
  PRIMARY KEY (`character_id`),
  CONSTRAINT `fk_stats_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='캐릭터 기본 능력치';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `character_stats`
--

LOCK TABLES `character_stats` WRITE;
/*!40000 ALTER TABLE `character_stats` DISABLE KEYS */;
INSERT INTO `character_stats` VALUES (1,251,1255,300,150,0.00,0.00),(2,100,1000,200,150,0.00,0.00),(7,1,1,1,1,1.00,1.00);
/*!40000 ALTER TABLE `character_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `characters` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '캐릭터 PK',
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '캐릭터 고유 식별자(URL 및 API용)',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '캐릭터 이름',
  `element` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '캐릭터 속성',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '캐릭터 대표 이미지 경로',
  `element_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '속성 아이콘 이미지 경로',
  `list_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '캐릭터 목록 이미지',
  `melee_proficiency` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '근접 무기 숙련 타입',
  `ranged_proficiency` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '원거리 무기 숙련 타입',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '캐릭터 데이터 생성 일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='캐릭터 기본 정보 (루트 테이블)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,'berenica','베레니카','umbro','characters/berenica_v1.png','/images/element_icon/umbro.png','character_list/berenica.png','sword','dualPistols','2026-01-13 14:08:10'),(2,'new-character','뉴캐릭','pyro','0ecbe94c-b8be-4310-85a3-e4d84a0edf01.png','/images/element_icon/pyro.png','eb6d5684-9c87-4cc6-8f44-2420a788c5ed.png','sword','bow',NULL),(7,'test01','test01','hydro','85db1912-d184-4fac-a2f5-5dad9f2794b0.png','/images/element_icon/hydro.png','62aa564f-cc88-482f-bcb3-2461c4b47b15.png','dualBlades','assaultRifle','2026-01-24 12:38:01');
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `common_code_labels`
--

DROP TABLE IF EXISTS `common_code_labels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `common_code_labels` (
  `code_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`code_type`,`code`,`label`),
  CONSTRAINT `common_code_labels_common_codes_FK` FOREIGN KEY (`code_type`, `code`) REFERENCES `common_codes` (`code_type`, `code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `common_code_labels`
--

LOCK TABLES `common_code_labels` WRITE;
/*!40000 ALTER TABLE `common_code_labels` DISABLE KEYS */;
INSERT INTO `common_code_labels` VALUES ('ATTACK_TYPE','slash','베기'),('ATTACK_TYPE','smash','진동'),('ATTACK_TYPE','spike','관통'),('ELEMENT','anemo','바람'),('ELEMENT','electro','번개'),('ELEMENT','hydro','물'),('ELEMENT','lumino','빛'),('ELEMENT','pyro','불'),('ELEMENT','umbro','어둠'),('FEATURE','consonanceWeapon','동조 무기'),('FEATURE','control','제어'),('FEATURE','def','방어'),('FEATURE','dps','딜러'),('FEATURE','heal','치료'),('FEATURE','maxHp','최대 HP'),('FEATURE','maxSanity','최대 정신력'),('FEATURE','sanityRecovery','정신력 회복'),('FEATURE','shield','실드'),('FEATURE','skillDmg','스킬 대미지'),('FEATURE','summon','소환물'),('FEATURE','support','서포터'),('FEATURE','weaponDmg','무기 대미지'),('MELEEWEAPON','dualBlades','쌍도'),('MELEEWEAPON','greatsword','대검'),('MELEEWEAPON','katana','대도'),('MELEEWEAPON','polearm','장병기'),('MELEEWEAPON','sword','한손검'),('MELEEWEAPON','whipsword','칼날 채찍'),('RANGEDWEAPON','assaultRifle','돌격소총'),('RANGEDWEAPON','bow','활'),('RANGEDWEAPON','dualPistols','쌍권총'),('RANGEDWEAPON','grenadeLauncher','핸드 캐논'),('RANGEDWEAPON','pistol','권총'),('RANGEDWEAPON','shotgun','산탄총'),('STAT','attack','공격력'),('STAT','defense','방어력'),('STAT','hp','체력'),('STAT','maxMentality','최대 정신력'),('STAT','morale','격양'),('STAT','resolve','필사'),('WORD','attack','공격력'),('WORD','attackSpeed','공격 속도'),('WORD','attackType','공격 타입'),('WORD','buff','버프'),('WORD','category','카테고리'),('WORD','critDamage','치명타 피해'),('WORD','critRate','치명타 확률'),('WORD','element','속성'),('WORD','feature','특성'),('WORD','meleeProficiency','근거리 무기 마스터리'),('WORD','passive','패시브'),('WORD','rangedProficiency','원거리 무기 마스터리'),('WORD','triggerProbability','발동 확률'),('WORD','weaponType','무기 타입');
/*!40000 ALTER TABLE `common_code_labels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `common_codes`
--

DROP TABLE IF EXISTS `common_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `common_codes` (
  `code_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`code_type`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `common_codes`
--

LOCK TABLES `common_codes` WRITE;
/*!40000 ALTER TABLE `common_codes` DISABLE KEYS */;
INSERT INTO `common_codes` VALUES ('ATTACK_TYPE','slash'),('ATTACK_TYPE','smash'),('ATTACK_TYPE','spike'),('ELEMENT','anemo'),('ELEMENT','electro'),('ELEMENT','hydro'),('ELEMENT','lumino'),('ELEMENT','pyro'),('ELEMENT','umbro'),('FEATURE','consonanceWeapon'),('FEATURE','control'),('FEATURE','def'),('FEATURE','dps'),('FEATURE','heal'),('FEATURE','maxHp'),('FEATURE','maxSanity'),('FEATURE','sanityRecovery'),('FEATURE','shield'),('FEATURE','skillDmg'),('FEATURE','summon'),('FEATURE','support'),('FEATURE','weaponDmg'),('MELEEWEAPON','dualBlades'),('MELEEWEAPON','greatsword'),('MELEEWEAPON','katana'),('MELEEWEAPON','polearm'),('MELEEWEAPON','sword'),('MELEEWEAPON','whipsword'),('RANGEDWEAPON','assaultRifle'),('RANGEDWEAPON','bow'),('RANGEDWEAPON','dualPistols'),('RANGEDWEAPON','grenadeLauncher'),('RANGEDWEAPON','pistol'),('RANGEDWEAPON','shotgun'),('STAT','attack'),('STAT','defense'),('STAT','hp'),('STAT','maxMentality'),('STAT','morale'),('STAT','resolve'),('WORD','attack'),('WORD','attackSpeed'),('WORD','attackType'),('WORD','buff'),('WORD','category'),('WORD','critDamage'),('WORD','critRate'),('WORD','element'),('WORD','feature'),('WORD','meleeProficiency'),('WORD','passive'),('WORD','rangedProficiency'),('WORD','triggerProbability'),('WORD','weaponType');
/*!40000 ALTER TABLE `common_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consonance_weapons`
--

DROP TABLE IF EXISTS `consonance_weapons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consonance_weapons` (
  `character_id` bigint NOT NULL COMMENT 'characters.id (캐릭터 전용 동조 무기)',
  `category` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '무기 카테고리 (근접/원거리)',
  `weapon_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '무기 타입',
  `attack_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '공격 타입 (베기/관통/진동)',
  `attack` decimal(6,2) NOT NULL COMMENT '무기 공격력',
  `crit_rate` decimal(5,2) NOT NULL COMMENT '치명타 확률(%)',
  `crit_damage` decimal(5,2) NOT NULL COMMENT '치명타 피해량(%)',
  `attack_speed` decimal(4,2) NOT NULL COMMENT '공격 속도',
  `trigger_probability` decimal(5,2) NOT NULL COMMENT '발동 확률(%)',
  PRIMARY KEY (`character_id`),
  CONSTRAINT `fk_weapon_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='캐릭터 전용 동조 무기 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consonance_weapons`
--

LOCK TABLES `consonance_weapons` WRITE;
/*!40000 ALTER TABLE `consonance_weapons` DISABLE KEYS */;
INSERT INTO `consonance_weapons` VALUES (1,'melee','sword','slash',361.50,12.00,150.00,1.00,50.00),(2,'melee','dualBlades','slash',300.50,12.00,150.00,1.00,50.00),(7,'melee','dualBlades','slash',1.00,1.00,1.00,1.00,1.00);
/*!40000 ALTER TABLE `consonance_weapons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `introns`
--

DROP TABLE IF EXISTS `introns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `introns` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '근원 PK',
  `character_id` bigint NOT NULL COMMENT 'characters.id 참조',
  `stage` int NOT NULL COMMENT '근원 단계 (1~6)',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '근원 단계별 효과 설명',
  PRIMARY KEY (`id`),
  KEY `fk_intron_character` (`character_id`),
  CONSTRAINT `fk_intron_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='캐릭터 근원 단계 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `introns`
--

LOCK TABLES `introns` WRITE;
/*!40000 ALTER TABLE `introns` DISABLE KEYS */;
INSERT INTO `introns` VALUES (1,1,1,'스파이럴 점프와 [잔광] 시전 시, 자신은 1단계의 스킬 효율 8% 상승 효과를 획득한다. 지속 시간 12초, 최대 3단계 중첩.'),(2,1,2,'HP 비율이 잣힌보다 낮은 대상에게 입히는 대미지 30% 상승.'),(3,1,3,'[잔광] 레벨+2, [회전] 레벨+1'),(4,1,4,'자신의 콤보 레벨에 따라 공격이 상승한다. 레벨당 20% 상승.'),(5,1,5,'[어둠의 불꽃] 레벨+2, [회전] 레벨+1'),(6,1,6,'[어둠의 불꽃] 사용 후, 검기 발동 시 일정 확률로 1개의 검기를 추가로 생성한다. 확률은 [이미르] 발동 확률 속성치의 25.0%'),(45,7,1,'1'),(46,7,2,'2'),(47,7,3,'3'),(48,7,4,'4'),(49,7,5,'5'),(50,7,6,'6'),(53,2,1,'...'),(54,2,2,'...');
/*!40000 ALTER TABLE `introns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (2,'lee','lee','$2a$10$oDcQI7yRj0TZpinVADM/Ne6qULauP08rHTkDi5GsR/Phpx3vDu/Jy','ADMIN','2026-01-13 14:11:52');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '스킬 PK',
  `character_id` bigint NOT NULL COMMENT 'characters.id 참조',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '스킬 이름',
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '스킬 타입 (대미지/버프/패시브)',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '스킬 설명',
  PRIMARY KEY (`id`),
  KEY `fk_skill_character` (`character_id`),
  CONSTRAINT `fk_skill_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='캐릭터 스킬 정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,1,'어둠의 불꽃','buff','근접 무기를 [이미르]로 교체하여 1개의 검기를 날리고, [이미르]로 기본 공격을 할 때 공격 방향으로 검기를 날린다. [이미르]를 사용하는 동안 자신이 대미지를 받을 시 경직되지 않으며, 정신력이 지속적으로 소모되고, 정신력이 0이 되거나 해당 스킬을 다시 사용하면 [이미르]를 회수한다.'),(2,1,'회전','passive','[잔광]이나 한손검으로 대미지를 입힐 시, 일정 확률로 정신력을 회복한다.'),(10,7,'21','buff','123'),(12,2,'스킬1','buff','...');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploaded_images`
--

DROP TABLE IF EXISTS `uploaded_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploaded_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`filename`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploaded_images`
--

LOCK TABLES `uploaded_images` WRITE;
/*!40000 ALTER TABLE `uploaded_images` DISABLE KEYS */;
INSERT INTO `uploaded_images` VALUES (1,'85db1912-d184-4fac-a2f5-5dad9f2794b0.png',1,'2026-01-24 21:36:06'),(4,'62aa564f-cc88-482f-bcb3-2461c4b47b15.png',1,'2026-01-24 21:36:34'),(10,'eb6d5684-9c87-4cc6-8f44-2420a788c5ed.png',1,'2026-01-25 18:55:44'),(12,'0ecbe94c-b8be-4310-85a3-e4d84a0edf01.png',1,'2026-01-25 18:55:54');
/*!40000 ALTER TABLE `uploaded_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dna'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-07 16:18:46
