import parse from '../lib/parse/index';

const html = `<view class="address-container">
<view class="map-wrapper">
  <map
    class="map"
    id="map"
    longitude="{{location.longitude}}"
    latitude="{{location.latitude}}"
    scale="{{scale}}"
    bindregionchange='regionChange'
    show-location="true"/>
  <cover-view class="locate-wrapper">
    <cover-image
      src="{{ cdnPath + 'icon-locate.png'}}"
      bindtap="handleLocate"
      class="locate-img"/>
  </cover-view>
  <cover-view class="mark-wrapper">
    <cover-image
      src="{{ cdnPath + 'icon-locate-mark.png'}}"
      class="mark-img"/>
  </cover-view>
  <view class="info-wrapper">
    <view
      bindtap="handleGoToSearch"
      class="address-item">
      <view class="address-text">
        <text>{{address.title || '正在定位'}}</text>
        <text>{{address.address || ''}}</text>
      </view>
      <image
        mode="aspectFit"
        src="{{cdnPath + 'icon-arrow-right.png'}}"/>
    </view>
    <view class="house-item">
      <input
        bindinput="handleAddressInput"
        value="{{address.street}}"
        placeholder-style="color:#9399A5;font-size:28rpx;font-weight:normal"
        placeholder="请输入具体门牌号"/>
      <image
        wx:if="{{showCancelIcon}}"
        bindtap="handleCancelText"
        mode="aspectFit"
        src="{{cdnPath + 'icon-clear.png'}}"/>
    </view>
    <view class="floor-item">
      <text
        bindtap="showFloorPicker"
        class="{{floor.text && 'floor-text'}} text">{{ floor.text || (type === 'from' ? '搬出楼层（必填）' : '搬入楼层（必填）') }}</text>
      <button class="btn-primary" bindtap="handleConfirm">确定</button>
    </view>
  </view>
</view>
<floor-picker
  isShow="{{floorPickerIsShow}}"
  bindcancelclick="handleCancelClick"
  bindconfirmclick="handleConfirmClick"/>
</view>`;

const swan = parse.wxml2swan(html);

console.log(swan);
