// import icons from '../img/icons.svg'; //Parcel 1  包裹1
import icons from 'url:../../img/icons.svg'; //Parcel 2  包裹
export default class View {
  _data;
  /**
   *Render the received object to the DOM 将接收到的对象渲染到DOM
   * @param {Object|Object[]} data The data ti be rendered (e.g. recipe) 要渲染的数据（例如食谱）
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM 如果为false，创建标记字符串而不是渲染到DOM
   * @returns {undefined|string} A markup string is returned if render = false 如果渲染= false，将返回标记字符串
   * @this {Object} View Object
   * @author TYY  作者
   * @todo Finish implementation 完成实施
   */
  //提供
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    //js创建的DOM解构
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //Update changed ATTRIBUES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  //清除
  _clear() {
    this._parentElement.innerHTML = '';
  }
  //渲染器
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // 错误
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
