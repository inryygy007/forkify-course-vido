import icons from 'url:../../img/icons.svg';
import View from './view.js';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerCLick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // e.defaultPrevented();//事件委托
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      //获取data-goto的数据
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //Page 1, and there are other pages 第1页，还有其他页面
    if (curPage === 1 && numPages > 1) {
      return this._nextBtn(curPage);
    }
    //Last page 最后一页
    if (curPage === numPages && numPages > 1) {
      return this._prevBtn(curPage);
    }
    // Other page 另一页
    if (curPage < numPages) {
      const html = this._nextBtn(curPage) + this._prevBtn(curPage);
      return html;
    }
    //Page 1, and there are No other pages 第1页，没有其他页面
    return ``;
  }
  _nextBtn(curPage) {
    return `
    <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
      <span> Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
     </button>
    `;
  }
  _prevBtn(curPage) {
    return `
    <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span> Page ${curPage - 1}</span>
    </button>
    `;
  }
}

export default new PaginationView();
