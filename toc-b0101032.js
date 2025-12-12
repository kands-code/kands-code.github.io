// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item "><span class="chapter-link-wrapper"><a href="init.html">Init</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="about.html">About</a></span></li><li class="chapter-item "><li class="part-title">Notes</li></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/haskell/index.html">Haskell</a><a class="chapter-fold-toggle"><div>❱</div></a></span><ol class="section"><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/haskell/20241030-haskell-99-questions-0x01.html">Haskell 99 Questions :: 0x01</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/haskell/20241031-haskell-99-questions-0x02.html">Haskell 99 Questions :: 0x02</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/haskell/20241104-haskell-99-questions-0x03.html">Haskell 99 Questions :: 0x03</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/haskell/20241208-haskell-99-questions-0x04.html">Haskell 99 Questions :: 0x04</a></span></li></ol><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/index.html">Rust</a><a class="chapter-fold-toggle"><div>❱</div></a></span><ol class="section"><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20240727-rust-fuction-and-clousure.html">Rust 中的函数与闭包</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20241102-sicp-notes-0x01.html">SICP 笔记 - 0x01</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20241105-sicp-notes-0x02.html">SICP 笔记 - 0x02</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250225-sicp-notes-0x03.html">SICP 笔记 - 0x03</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250316-sicp-notes-0x04.html">SICP 笔记 - 0x04</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250317-sicp-notes-0x05.html">SICP 笔记 - 0x05</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250319-sicp-notes-0x06.html">SICP 笔记 - 0x06</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250321-sicp-notes-0x07.html">SICP 笔记 - 0x07</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250419-sicp-notes-ex01.html">SICP 笔记 - ex01</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20251109-sicp-notes-ex02.html">SICP 笔记 - ex02</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250710-phyrs-0x01.html">Phyrs - 0x01</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250711-phyrs-0x02.html">Phyrs - 0x02</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250712-phyrs-0x03.html">Phyrs - 0x03</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250713-phyrs-0x04.html">Phyrs - 0x04</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250715-phyrs-0x05.html">Phyrs - 0x05</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/rust/20250717-phyrs-0x06.html">Phyrs - 0x06</a></span></li></ol><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/index.html">SageMath</a><a class="chapter-fold-toggle"><div>❱</div></a></span><ol class="section"><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/20240829-sagemath-0x00.html">安装 SageMath</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/20240830-sagemath-0x01.html">SageMath 基本运算与函数</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/20240831-sagemath-0x02.html">SageMath 基本语法</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/20240831-sagemath-0x03.html">SageMath 代数初步</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/20240901-sagemath-0x04.html">SageMath 基本作图</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/20240905-sagemath-0x05.html">SageMath 基本代数</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="notes/sagemath/20240906-sagemath-0x06.html">SageMath 多项式</a></span></li></ol><li class="chapter-item "><li class="part-title">Miscellany</li></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/index.html">Coding</a><a class="chapter-fold-toggle"><div>❱</div></a></span><ol class="section"><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20210604-scope-of-if-statement.html">if 语句的作用域</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20221026-parse-math-in-c.html">C 语言数学解析器</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20231107-clash-system-agent.html">C𝜆ash 系统代理</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20240228-use-giscus-in-mdbook.html">在 mdBook 中使用 giscus 服务</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20240727-use-steam-install-windows-applications.html">使用 Steam 安装 Windows 应用</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20241122-meson-for-cpp.html">使用 Meson 构建 Cpp 项目</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20250423-rust-link-static-library-on-macos.html">在 macOS 上使用 Rust 链接静态库</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/coding/20251124-use-katex-in-mdbook.html">在 mdBook 中使用 KaTeX 渲染公式</a></span></li></ol><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/study/index.html">Study</a><a class="chapter-fold-toggle"><div>❱</div></a></span><ol class="section"><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/study/20221108-qiskit-linear-algebra.html">Qiskit 线性代数</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/study/20221111-qiskit-Deutsch-Jozsa-algorithm.html">Qiskit Deutsch-Jozsa 算法</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/study/20241222-qr-decomposition.html">计算 QR 分解</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/study/20241226-linear-norm.html">向量与矩阵的模</a></span></li></ol><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/index.html">Life</a><a class="chapter-fold-toggle"><div>❱</div></a></span><ol class="section"><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20230411-about-life.html">说说以后的打算罢</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20230715-about-job.html">谈谈最近的工作状态</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20230915-end-of-summer.html">暑假结束了</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20231020-new-life.html">新的生活</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20240120-busy-life.html">忙忙碌碌</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20240404-decadent-life.html">颓废生活</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20240721-home-life.html">居家生活</a></span></li><li class="chapter-item "><span class="chapter-link-wrapper"><a href="miscellany/life/20250613-find-job.html">工作焦虑</a></span></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

