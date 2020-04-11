<template lang="pug">
  section.welcomeLogoWrapper
    table
      tr(v-for="row in 3" :class="`row${row}`")
        td(v-for="col in 8" :class="`col${col}`")

</template>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

$snakeBodyColor: $mainColor;
$snakeHeadColor: yellow;

.welcomeLogoWrapper {
  display: block;
  margin: 0 auto;
  width: 500px;
  height: 200px;

  table {
    width: 100%;
    height: 100%;

    td {
      border: 1px solid $secondColor;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
    }

    tr.row1 {
      @for $col from 1 through 7 {
        td.col#{$col} {
          background: $snakeBodyColor;
        }
      }

      td.col8 {
        background: $snakeHeadColor;
      }
    }

    tr.row2 {
      td.col1 {
        background: $snakeBodyColor;
      }
    }

    tr.row3 {
      @for $col from 1 through 4 {
        td.col#{$col} {
          background: $snakeBodyColor;
        }
      }
    }
  }
}
</style>
