import regeneratorRuntime from 'regenerator-runtime';
import * as API from '../../apis/base';
import Utils from '../../utils/base';

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    isOnline: {
      type: Boolean
    },
    redirect: {
      type: String,
    },
  },
  data: {
    userInfo: {},
    dialogTop: '',
    dialogShow: false,
    inputPhone: '',
    inputCode: '',
    picCode: '',
    inputPicCode: '',
    picDialogShow: false,
    loading: false,
    countDownTxt: ''
  },
  ready() {
    Utils.login().then(v => console.log(v)).catch(err => console.log(err));
    console.log('login ready');
  },
  methods: {
    async getWXUserInfo() {
      // login:wx or phone
      const userInfo = await Utils.getUserInfo();
      this.setData({ userInfo });
    },
    // picture verity code
    showPicDialog() {
      const { inputPhone, loading } = this.data;
      if (inputPhone.length !== 11 || String(Number(inputPhone)) === 'NaN') {
        Utils.toast.error('手机号无效');
        return;
      }
      if (loading) {
        return;
      }
      this.sendSMSCode();
      // this.setData({ picDialogShow: true });
      // this.picCodeRefresh();
    },
    picCodeRefresh() {
      const url = `https://wx.api.ke.com/verify/picture?mobile=${this.data.inputPhone}&channel=login&t=${+new Date()}`;
      // const url = `http://preview-wx.api.ke.com/verify/picture?mobile=${this.data.inputPhone}&channel=login&t=${+new Date()}`;
      this.setData({ picCode: url });
    },
    // send msg code
    async sendSMSCode() {
      this.data.loading = true;
      try {
        await API.wxSendSMSCode({
          phone: this.data.inputPhone
        });
        Utils.toast.success('发送成功');
        // this.setData({ picDialogShow: false });
        Utils.countDown(59 * 1000, (res, duration) => {
          this.setData({
            countDownTxt: duration ? `${res}s 后(重发)` : ''
          });
          if (!duration) {
            this.data.loading = false;
          }
        }, 'ss');
      } catch (err) {
        this.data.loading = false;
        Utils.toast.error('发送失败');
        // this.picCodeRefresh();
      }
    },
    getInputPhone(e) {
      const phone = e.detail.value;
      this.setData({ inputPhone: phone });
    },
    getInputCode(e) {
      const code = e.detail.value;
      this.setData({ inputCode: code });
    },
    loginSuccess(v) {
      Utils.save('session_id', v.data.id);
      const mobile = v.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      Utils.save('user_info', {
        favicon: v.data.favicon,
        mobile,
      });
      Utils.toast.success('登录成功');
      this.setData({ dialogShow: false });
      this.data.onLogining = false;
      this.triggerEvent('login');
    },
    async wxLogin(e) {
      const cryped = e.detail;
      const { iv, encryptedData } = cryped;
      if (!iv) {
        // user deny
        // this.phoneDialogShow();
        return;
      }
      const { code } = await Utils.login();
      try {
        const res = await API.wxLogin({
          code,
          encryptedData,
          iv,
        });
        this.loginSuccess(res);
      } catch (err) {
        console.log('oh no~~~', err);
        if (err && err.code === 20005) {
          // 跳用户注册
          this.phoneDialogShow();
        } else {
          Utils.toast.error('登录失败');
        }
      }
    },
    getFocus() {
      // this.setData({ dialogTop: '100rpx' })
    },
    phoneDialogShow() {
      this.setData({ dialogShow: true });
    },
    closeDialog() {
      this.setData({ dialogShow: false });
    },
    getInputPicCode(e) {
      this.setData({ inputPicCode: e.detail.value });
    },
    async phoneLogin() {
      if (this.data.onLogining) {
        return;
      }
      const { inputPhone, inputCode } = this.data;
      if (inputPhone.length !== 11 || String(Number(inputPhone)) === 'NaN') {
        Utils.toast.error('手机号无效');
        return;
      }
      if (!inputCode) {
        Utils.toast.error('请输入验证码');
        return;
      }
      const { code } = await Utils.login().catch(err => console.log(err));
      this.data.onLogining = true;
      try {
        const res = await API.wxFastLogin({
          code,
          phone: this.data.inputPhone,
          verifyCode: this.data.inputCode,
        });
        this.loginSuccess(res);
      } catch (err) {
        console.log(err);
        this.data.onLogining = false;
        Utils.toast.error('登录失败');
      }
    },
    closePicDialog() {
      this.setData({ picDialogShow: false });
    },
  },
});
