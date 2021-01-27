/**
 * Created by Jacob Xie on 1/27/2021
 */

import React from 'react'
import {Space} from "antd"

import "@/components/EchartsPro/themes/chalk"
import "@/components/EchartsPro/themes/dark"
import "@/components/EchartsPro/themes/essos"
import "@/components/EchartsPro/themes/infographic"
import "@/components/EchartsPro/themes/macarons"
import "@/components/EchartsPro/themes/purple-passion"
import "@/components/EchartsPro/themes/roma"
import "@/components/EchartsPro/themes/shine"
import "@/components/EchartsPro/themes/vintage"
import "@/components/EchartsPro/themes/walden"
import "@/components/EchartsPro/themes/westeros"
import "@/components/EchartsPro/themes/wonderland"

import Style from "./theme.less"

export const vintage =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "rgb(254, 248, 239)"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(216, 124, 124)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(145, 158, 139)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(215, 171, 130)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(110, 112, 116)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(97, 160, 168)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(239, 161, 141)"}}/>
  </Space>

export const dark =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "rgb(51, 51, 51)"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(221, 107, 102)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(117, 154, 160)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(230, 157, 135)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(141, 193, 169)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(234, 126, 83)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(238, 221, 120)"}}/>
  </Space>

export const westeros =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "transparent"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(81, 107, 145)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(89, 196, 230)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(237, 175, 218)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(147, 183, 227)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(165, 231, 240)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(203, 176, 227)"}}/>
  </Space>

export const essos =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "rgba(242, 234, 191, 0.15)"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(137, 52, 72)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(217, 88, 80)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(235, 129, 70)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(255, 178, 72)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(242, 214, 67)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(235, 219, 164)"}}/>
  </Space>

export const wonderland =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "transparent"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(78, 163, 151)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(34, 195, 170)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(123, 217, 165)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(208, 100, 138)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(245, 141, 178)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(242, 179, 201)"}}/>
  </Space>

export const walden =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "rgba(252, 252, 252, 0)"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(63, 177, 227)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(107, 230, 193)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(98, 108, 145)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(160, 167, 230)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(196, 235, 173)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(150, 222, 232)"}}/>
  </Space>

export const chalk =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "rgb(41, 52, 65)"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(252, 151, 175)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(135, 247, 207)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(247, 244, 148)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(114, 204, 255)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(247, 197, 160)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(212, 164, 235)"}}/>
  </Space>

export const infographic =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "transparent"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(193, 35, 43)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(39, 114, 123)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(252, 206, 16)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(232, 124, 37)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(181, 195, 52)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(254, 132, 99)"}}/>
  </Space>

export const macarons =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "transparent"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(46, 199, 201)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(182, 162, 222)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(90, 177, 239)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(255, 185, 128)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(216, 122, 128)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(141, 152, 179)"}}/>
  </Space>

export const roma =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "transparent"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(224, 31, 84)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(0, 24, 82)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(245, 232, 200)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(184, 210, 199)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(198, 179, 142)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(164, 216, 194)"}}/>
  </Space>

export const shine =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "transparent"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(193, 46, 52)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(230, 182, 0)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(0, 152, 217)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(43, 130, 29)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(0, 94, 170)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(51, 156, 168)"}}/>
  </Space>

export const purplePassion =
  <Space direction="horizontal" className={Style.themePlanGroup} style={{backgroundColor: "rgb(91, 92, 110)"}}>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(138, 124, 168)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(224, 152, 199)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(143, 211, 232)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(113, 102, 158)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(204, 112, 175)"}}/>
    <div className={Style.themePlanColor} style={{backgroundColor: "rgb(124, 180, 204)"}}/>
  </Space>

export const themeSelections = [
  {name: "essos", ele: essos},
  {name: "infographic", ele: infographic},
  {name: "macarons", ele: macarons},
  {name: "roma", ele: roma},
  {name: "shine", ele: shine},
  {name: "vintage", ele: vintage},
  {name: "walden", ele: walden},
  {name: "westeros", ele: westeros},
  {name: "wonderland", ele: wonderland},
  {name: "purple-passion", ele: purplePassion},
  {name: "chalk", ele: chalk},
  {name: "dark", ele: dark},
]