# answer-card

작은 답변 카드입니다. 자료를 주면 고르기 · 여러 개 고르기 · 항목별 승인 카드를 그리고, 확정을 누르면 고른 내용을 글로 만들어 그 화면의 `sendPrompt` 함수에 넘깁니다. 인터넷에 보내거나 저장하는 것은 없습니다.

A small answer card. It draws a card from the data you give and passes the picked answer to the page's `sendPrompt` function. It sends nothing over the network and stores nothing.

```html
<div id="k"></div>
<script src="card.js"></script>
<script>answerCard({"tag":"견본 1판","q":"간단한 물음","a":[["네","누르면 하는 일"],["아니요","누르면 하는 일"]]})</script>
```
