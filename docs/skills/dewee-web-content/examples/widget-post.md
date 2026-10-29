---
title: How a widget post reads
slug: how-a-widget-post-reads
locale: en
description: A sample post that places every P0 widget inline, in reading order, between paragraphs of Markdown.
tags: [product, widgets]
blocks: ./widget-post.blocks.json
---
Posts are **Markdown first**. Widgets sit between paragraphs: each one is a block in `blocks`
with an `id`, and a line `::widget{id="…"}` places it in the body.

## Where a chart will go

Charts arrive later. Until then a callout and a short list of steps carry the numbers.

::widget{id="chart-placeholder"}

The steps below are what the chart will show, as text that every reader and every feed can use.

::widget{id="rollout-steps"}

## A diagram, in words for now

::widget{id="diagram-placeholder"}

## Screens

::widget{id="screens"}

## Watch it run

::widget{id="walkthrough"}

A native video plays inline with captions:

::widget{id="clip"}

## What people said

::widget{id="reaction"}

## Wrapping up

Directives inside code stay code:

```md
::widget{id="screens"}
```

::widget{id="install"}

That is the whole format. Blocks that the body never places follow the conclusion.
