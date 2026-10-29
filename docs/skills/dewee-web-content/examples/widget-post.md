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

## Your turn

Polls, quizzes and surveys are forms: they work without JavaScript, and answers are stored
anonymously. A poll shows the split after you vote, and you can change your vote.

::widget{id="first-agent-poll"}

A quiz keeps its answer to itself until you answer.

::widget{id="approval-quiz"}

Survey answers go to the team only; nobody else sees them.

::widget{id="next-post-survey"}

A demo from an allowed host runs in a sandbox, and only after you ask for it.

::widget{id="pen-demo"}

## Wrapping up

Directives inside code stay code:

```md
::widget{id="screens"}
```

::widget{id="install"}

That is the whole format. Blocks that the body never places follow the conclusion.
