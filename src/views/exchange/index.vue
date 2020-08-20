<template>
  <page-header-wrapper>
    <a-row :gutter="24" type="flex">
      <a-col>
        <a-card class="search-list-wrapper">
          <div class="search-opera-wrapper">
            <a-input-search placeholder="输入交易所名称" @search="onSearch" />
          </div>

          <div class="exchange-list-wrapper">
            <div class="exchange-list-item exchange-list-item--active">
              火币
            </div>
            <div class="exchange-list-item">
              OKEX
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :flex="1">
        <!-- <account-list-table >
        </account-list-table> -->
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
// import AccountListTable from ''
export default {}
</script>

<style lang="less">
@import '~ant-design-vue/es/style/themes/default.less';
.search-list-wrapper {
  height: 800px;
  /deep/ .ant-card-body {
    padding: 0px;
  }
  .search-opera-wrapper {
    padding: 5px;
  }
}
.exchange-list-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  &--active {
    background-color: @alert-info-bg-color;
    border-color: @alert-info-border-color;
  }
  &:hover {
    background-color: @alert-info-bg-color;
  }
}
</style>
