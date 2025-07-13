/**
 * B2B Solution Theme - Main JavaScript File
 *
 * Contents:
 * 1. jQuery Dependent Code (Slick Slider)
 * 2. DOMContentLoaded Event (All other vanilla JS)
 * - Mobile Menu Toggle
 * - Header Scroll Effect
 * - Smooth Scrolling
 * - FAQ Accordion
 * - Case Study Details Toggle
 * - Button Click Handlers (Download, etc.)
 * - Contact Form 7 Integration
 */

// ===================================================================
// 1. jQuery Dependent Code (Slick Slider)
// ===================================================================
// jQueryが読み込まれてから実行されるおまじない
jQuery(function ($) {
    // ケーススタディ（導入事例）のスライダーを初期化
    $('.case-study-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        adaptiveHeight: true, // スライドの高さが違っても対応
        autoplay: true,
        autoplaySpeed: 6000,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',


        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false // スマホでは左右の矢印を非表示
                }
            }
        ]
    });

    $('.read-more-btn').on('click', function () {
        // 1. Get the details section that's right after the button
        $(this).closest('.case-study-card').toggleClass('is-active');

        const details = $(this).next('.case-study-details');


        // 2. Animate it with a smooth slide down/up
        details.slideToggle(500, function () {
            // 3. (The Fix!) After the animation is complete,
            //    tell the slider to update its height.
            $('.case-study-slider').slick('setPosition');
        });

        // 4. (Optional) Change the button text
        // Checks the current text and toggles it between "詳細を見る" and "閉じる"
        const buttonText = $(this).text();
        $(this).text(buttonText === '詳細を見る' ? '閉じる' : '詳細を見る');
    }); ß
});


// ===================================================================
// 2. DOMContentLoaded Event (Vanilla JavaScript)
// ===================================================================
// ページのHTMLがすべて読み込まれてから実行されるおまじない
document.addEventListener('DOMContentLoaded', function () {

    /**
     * Mobile Menu Toggle
     * ハンバーガーメニューの開閉を制御
     */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    /**
     * Header Scroll Effect
     * スクロールしたらヘッダーに背景色を付ける
     */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            // 100px以上スクロールしたら 'scrolled' クラスを付ける
            header.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    /**
     * Smooth Scrolling
     * ページ内リンク（#〜）をクリックした時にスムーズに移動させる
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // スマホ用メニューが開いていたら、リンククリックで閉じる
                if (navMenu) navMenu.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            }
        });
    });

    /**
     * FAQ Accordion
     * よくある質問の開閉を制御
     */
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.closest('.faq-item'); // .parentElement から変更
            if (faqItem) {
                faqItem.classList.toggle('active');
            }
        });
    });

    /**
     * Case Study Details Toggle
     * 導入事例の「詳細を見る」ボタンの開閉
     */
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function () {
            const details = this.nextElementSibling;
            if (details) {
                const isExpanded = details.classList.toggle('expanded');
                this.textContent = isExpanded ? '詳細を閉じる' : '詳細を見る';
            }
        });
    });

    /**
     * Document Download & Sales Simulation Buttons
     * 資料ダウンロードやシミュレーションボタンのクリックイベント
     */
    // HTMLから `onclick` を削除し、代わりにIDを付けてください
    // 例： <a href="#" id="downloadBtn" class="cta-button secondary">資料ダウンロード</a>
    const downloadButton = document.querySelector('#downloadButton'); // 仮のID
    if (downloadButton) {
        downloadButton.addEventListener('click', function (e) {
            e.preventDefault();
            alert('資料をダウンロードします。（実際にはPDFへのリンクなどに変更します）');
        });
    }
    // ※シミュレーションボタンも同様に追加してください

    /**
     * Contact Form 7 Integration
     * フォーム送信が成功したらサンクスページへ移動させる
     */
    document.addEventListener('wpcf7mailsent', function (event) {
        // あなたのサンクスページのURLをここに入れてください
        location = '/thank-you/';
    }, false);

    document.addEventListener('DOMContentLoaded', function () {
    
        const fixedCta = document.getElementById('fixedFooterCTA');
        const heroSection = document.getElementById('hero');
        const contactSection = document.getElementById('contact');

        // 必要な要素がすべて存在する場合のみ処理を実行
        if (fixedCta && heroSection && contactSection) {

            const handleCtaVisibility = () => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // CTAを表示し始める位置（ヒーローセクションの下端）
                const showPosition = heroSection.offsetTop + heroSection.offsetHeight;

                // CTAを非表示にし始める位置（コンタクトフォームの上端が画面下から少し見えたあたり）
                const hidePosition = contactSection.offsetTop - windowHeight + 150; // 150pxのマージン

                // 条件：表示位置を過ぎていて、かつ非表示位置にはまだ到達していない場合
                if (scrollY > showPosition && scrollY < hidePosition) {
                    fixedCta.classList.add('is-visible');
                } else {
                    fixedCta.classList.remove('is-visible');
                }
            };

            // スクロール時とページのリサイズ時に判定を実行
            window.addEventListener('scroll', handleCtaVisibility);
            window.addEventListener('resize', handleCtaVisibility);

            // 初期表示をチェック
            handleCtaVisibility();
        }

    });

    console.log('B2B Solution Theme JS Loaded Successfully!');
});