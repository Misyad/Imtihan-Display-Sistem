# 04-component-library.md

# Imtihan Display System
## Component Library

Version : 3.0

---

# Introduction

Seluruh komponen dalam aplikasi berasal dari Component Library.

Developer tidak diperbolehkan membuat komponen baru tanpa mengikuti standar ini.

Semua komponen harus:

- Consistent
- Reusable
- Accessible
- Responsive
- Themeable

---

# Component Hierarchy

Primitive

↓

Basic Components

↓

Business Components

↓

Page Components

---

# Primitive Components

Button

Icon

Text

Divider

Avatar

Badge

Surface

Container

Stack

Grid

Spacer

---

# Surface

Surface adalah dasar seluruh UI.

Jenis:

Primary Surface

Secondary Surface

Elevated Surface

Hero Surface

Dialog Surface

Overlay Surface

---

# Button

## Variants

Primary

Secondary

Outline

Ghost

Danger

Success

Warning

Link

Icon

Toolbar

---

## Shape

Small

Medium

Large

Round

Square

---

## Height

SM

36

MD

44

LG

52

XL

60

---

## State

Default

Hover

Focus

Pressed

Loading

Disabled

Success

Danger

---

## Rules

Primary

Emerald

Gold Border

Cream Text

Secondary

Cream

Gold Border

Primary Text

Danger

Red

Outline

Transparent

Gold Border

Ghost

No Border

---

# Icon Button

Square

44x44

Centered

Hover

Gold Glow

---

# Card

Jenis

Statistic

Content

Hero

Profile

Feature

Action

Session

Question

---

## Anatomy

Header

Divider

Body

Footer

---

## Rules

Border Gold

Radius XL

Padding 24

Shadow Medium

---

# Statistic Card

Berisi

Icon

Title

Value

Description

Trend

---

# Badge

Variants

Success

Danger

Warning

Info

Primary

Premium

---

# Input

Text

Number

Password

Email

Phone

URL

---

## State

Default

Focus

Filled

Error

Disabled

Readonly

---

# Textarea

Support

RTL

Markdown

Arabic

---

# Select

Single

Multiple

Searchable

Grouped

---

# Checkbox

Square

Gold Border

Emerald Checked

---

# Radio

Circle

Gold Border

---

# Switch

Rounded

Emerald Active

Cream Background

---

# Slider

Gold Track

Emerald Thumb

---

# Tabs

Underline Gold

Active Emerald

---

# Breadcrumb

Gold Divider

Chevron

---

# Pagination

Previous

Numbers

Next

---

# Tooltip

Dark

Cream Text

Gold Border

---

# Popover

Glass Cream

Gold Border

---

# Dropdown

Header

Divider

Items

Footer

---

# Context Menu

Icon

Shortcut

Danger

Divider

---

# Accordion

Header

Body

Chevron

---

# Alert

Info

Success

Warning

Danger

---

# Toast

Top Right

Auto Close

Glass Cream

Gold Border

---

# Dialog

Types

Confirm

Alert

Delete

Edit

Fullscreen

---

## Structure

Header

Body

Footer

---

# Drawer

Left

Right

Bottom

Fullscreen

---

# Sheet

Compact Panel

---

# Table

Header

Body

Footer

Pagination

---

## Features

Sorting

Filtering

Column Resize

Column Hide

Selection

Search

Sticky Header

---

# Data Grid

Virtual Scroll

Bulk Action

Export

Import

---

# Search Box

Rounded

Icon Left

Shortcut Hint

---

# Empty State

Illustration

Title

Description

Action

---

# Loading

Spinner

Skeleton

Progress

Linear

Circular

---

# Skeleton

Text

Card

Table

Avatar

Chart

---

# Progress

Linear

Circular

Step

---

# Timeline

Vertical

Horizontal

---

# Stepper

Wizard

Horizontal

Vertical

---

# Calendar

Month

Week

Day

Agenda

---

# Date Picker

Single

Range

Time

---

# Upload

Drag Drop

Browse

Preview

Progress

---

# Image Preview

Zoom

Rotate

Crop

Replace

Delete

---

# Gallery

Grid

Masonry

Slider

---

# QR Code

Generate

Preview

Download

---

# Code Block

Copy

Line Number

Highlight

---

# Markdown Viewer

Heading

List

Code

RTL

---

# Rich Text Editor

Bold

Italic

Underline

List

Arabic

RTL

Image

Table

---

# Question Card

Nomor

Kategori

Pertanyaan

Jawaban

Image

Action

---

# Session Card

Nama Event

Tanggal

Operator

Connection

---

# Statistics Widget

Title

Value

Chart

Trend

---

# Server Status

CPU

RAM

Socket

Latency

---

# Connection Badge

Connected

Disconnected

Reconnecting

Offline

---

# Activity Timeline

Timestamp

User

Action

Status

---

# Notification Center

Unread

Read

Filter

Search

---

# Theme Preview

Preview Card

Color

Typography

Pattern

---

# User Avatar

Initial

Image

Online Status

---

# Keyboard Shortcut

Visual Chip

Ctrl

Shift

Enter

---

# Component Rules

Semua komponen harus memiliki:

Hover State

Focus State

Keyboard Navigation

Responsive Behavior

RTL Support

Dark Theme Ready

Accessibility

---

# Animation Rules

Hover

150ms

Open

250ms

Close

200ms

Page

300ms

---

# Accessibility

Minimum Touch Target

44x44

Focus Ring

Visible

Keyboard Friendly

Screen Reader Ready

---

# Naming Convention

Primitive

UiButton

UiCard

UiInput

Business

QuestionCard

SessionCard

StatisticsCard

Page

DashboardHero

OperatorToolbar

QuestionEditor

---

# Reusability

Semua halaman hanya boleh menggunakan komponen dari library ini.

Tidak diperbolehkan membuat UI langsung di halaman.

Semua harus melalui Component Library.

---

# Final Principle

Jika sebuah komponen dapat digunakan lebih dari satu halaman,

maka komponen tersebut WAJIB berada di Component Library.

Page hanya menyusun komponen,

bukan membuat komponen baru.