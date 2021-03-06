-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: csy
-- ------------------------------------------------------
-- Server version	5.6.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `b_user_account`
--

DROP TABLE IF EXISTS `b_user_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `b_user_account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增长主键从1000开始',
  `account` varchar(16) NOT NULL COMMENT '帐号名称',
  `password` varchar(64) NOT NULL COMMENT '密码',
  `nickname` varchar(16) DEFAULT NULL COMMENT '昵称',
  `email` varchar(32) DEFAULT NULL COMMENT '邮箱',
  `emailStatue` tinyint(4) DEFAULT '2' COMMENT '邮箱是否激活1:正常、2:未激活',
  `phone` varchar(16) DEFAULT NULL COMMENT '手机号码',
  `phoneStatue` tinyint(4) DEFAULT '2' COMMENT '手机是否激活1:正常、2:未激活',
  `safeKey` varchar(128) NOT NULL COMMENT '安全密钥',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态1:正常、2:封号',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `account_UNIQUE` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=1005 DEFAULT CHARSET=utf8 COMMENT='用户帐号管理';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `b_user_filestore`
--

DROP TABLE IF EXISTS `b_user_filestore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `b_user_filestore` (
  `id` int(12) NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `foreign_account` varchar(16) NOT NULL COMMENT '外键帐号',
  `fileType` varchar(64) NOT NULL COMMENT '文件类型',
  `tags` varchar(128) DEFAULT NULL COMMENT '标签',
  `fileName` varchar(512) NOT NULL COMMENT '文件名称',
  `fileSize` bigint(16) NOT NULL COMMENT '文件大小',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(128) DEFAULT NULL COMMENT '文件描述信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=utf8 COMMENT='文件存储信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `b_user_info`
--

DROP TABLE IF EXISTS `b_user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `b_user_info` (
  `foreign_account` varchar(16) NOT NULL COMMENT '外键帐号',
  `gender` tinyint(4) DEFAULT '1' COMMENT '性别(1:男、0:女)  默认为男性',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `signature` varchar(32) DEFAULT NULL COMMENT '个性签名',
  `favicon` varchar(512) DEFAULT NULL COMMENT '头像地址',
  `blood` int(2) DEFAULT NULL COMMENT '血型',
  `address` varchar(128) DEFAULT NULL COMMENT '地址',
  `tag` varchar(128) DEFAULT NULL COMMENT '标签',
  PRIMARY KEY (`foreign_account`),
  UNIQUE KEY `foreign_account_UNIQUE` (`foreign_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户基本信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `b_xtpz_dmlx`
--

DROP TABLE IF EXISTS `b_xtpz_dmlx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `b_xtpz_dmlx` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `dmlxbh` int(10) NOT NULL COMMENT '代码类型编号',
  `ywm` varchar(32) NOT NULL COMMENT '代码类型英文名',
  `zwm` varchar(32) NOT NULL COMMENT '代码类型中文名',
  `p_ywm` varchar(32) DEFAULT NULL COMMENT '父代码类型英文名',
  `dmlxms` varchar(128) DEFAULT NULL COMMENT '代码类型描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dmlxywm_UNIQUE` (`ywm`),
  UNIQUE KEY `dmlxzwm_UNIQUE` (`zwm`),
  UNIQUE KEY `dmlxbh_UNIQUE` (`dmlxbh`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='代码类型管理';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `b_xtpz_dmx`
--

DROP TABLE IF EXISTS `b_xtpz_dmx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `b_xtpz_dmx` (
  `id` int(10) NOT NULL,
  `dmlxbh` int(10) NOT NULL COMMENT '外键 代码类型英文名',
  `dmxywm` varchar(32) NOT NULL COMMENT '代码项英文名',
  `dmxzwm` varchar(32) NOT NULL COMMENT '代码项中文名',
  `dmxz` varchar(128) NOT NULL COMMENT '值',
  `p_dmxywm` varchar(32) DEFAULT NULL COMMENT '父代码项英文名',
  `sfxs` int(2) DEFAULT '1' COMMENT '是否显示(1:显示,其他:不显示)',
  `sfky` int(2) DEFAULT '1' COMMENT '是否可用(1:可用,其他:不可用)',
  `sfmr` int(2) DEFAULT '0' COMMENT '是否默认(1:是,其他:否)',
  `xssx` int(4) DEFAULT NULL COMMENT '显示顺序',
  `dmxms` varchar(128) DEFAULT NULL COMMENT '代码项描述',
  `dmxkz` varchar(128) DEFAULT NULL COMMENT '代码项拓展(每个代码项可能有各自的拓展功能)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='代码项管理';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'csy'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-21 17:18:22
