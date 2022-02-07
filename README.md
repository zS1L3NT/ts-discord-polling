# Polling Bot

![License](https://img.shields.io/github/license/zS1L3NT/ts-discord-polling?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/ts-discord-polling?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/ts-discord-polling?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/ts-discord-polling?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/ts-discord-polling?style=for-the-badge)

Polling Bot is a Discord bot meant for users to create polls and see responses to those polls.
This bot has been shut down due to its low usage in servers.

## Motivation

I saw how most people do polling in discord, you react to the emoji you are voting for. However I didn't like this for a few reasons

1. You can respond to the poll more than once, even if it's not allowed in the polling rules
2. You can see everyones responses to polls, there is no choice for anonimity
3. You don't get any visualisations of the responses like pie charts
4. People can react to other emojis in the poll which aren't options in the poll

Because of this, I wanted to fix this issue, hence Polling Bot was created.

## Features

-   Discord Commands (Interactions)
    -   Create a Poll
        -   Change the title
        -   Change the description
        -   Change if the poll is anonymous
        -   Change if the poll allows multiple choices
        -   Set or Remove the closing date
        -   Add or Remove choices from the Poll
    -   Edit a Poll
        -   Change the title
        -   Change the description
        -   Set or Remove the closing date
        -   Admins can Close, Reopen and Delete polls
    -   Show which users voted what option in the Poll
-   Polling Channel
    -   Polling bot will need a dedicated channel to post all the Polls in. Set this with the `/set polls-channel`.
    -   The Polls in the channel refresh minutely, use `/refresh polls-channel` to manually refresh the channel
-   For every Poll, Polling bot show a pie chart of the results of the Poll

## Usage

With `yarn`

```
$ yarn
$ yarn run dev
```

With `npm`

```
$ npm i
$ npm run dev
```

## Built with

-   TypeScript
    -   [![@types/deep-equal](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/dev/@types/deep-equal?style=flat-square)](https://npmjs.com/package/@types/deep-equal)
    -   [![@types/luxon](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/dev/@types/luxon?style=flat-square)](https://npmjs.com/package/@types/luxon)
    -   [![typescript](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/dev/typescript?style=flat-square)](https://npmjs.com/package/typescript)
-   DiscordJS
    -   [![discord.js](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/discord.js?style=flat-square)](https://npmjs.com/package/discord.js)
-   Miscellaneous
    -   [![deep-equal](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/deep-equal?style=flat-square)](https://npmjs.com/package/deep-equal)
    -   [![firebase-admin](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/firebase-admin?style=flat-square)](https://npmjs.com/package/firebase-admin)
    -   [![luxon](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/luxon?style=flat-square)](https://npmjs.com/package/luxon)
    -   [![no-try](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/no-try?style=flat-square)](https://npmjs.com/package/no-try)
    -   [![nova-bot](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/nova-bot?style=flat-square)](https://npmjs.com/package/nova-bot)
    -   [![quickchart-js](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-polling/quickchart-js?style=flat-square)](https://npmjs.com/package/quickchart-js)
