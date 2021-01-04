const swiper = new Swiper('.swiper-container', {
  pagination: '.swiper-pagination',
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  autoplay: 3000,
  speed: 2000,
  slidesPerView: 1,
  paginationClickable: true,
  loop: true
});
$('.menu-button').click( function () {
if ($('.menu-button').hasClass('cross')) {
  $(this).removeClass('cross');
  $('.head-nav .logo').removeClass('display_none')
  $('.menu').removeClass('active')
} else {
  $(this).addClass('cross');
  $('.head-nav .logo').addClass('display_none')
  $('.menu').addClass('active')
}
})
if ($(window).width() < 789 ) {
$('.in-tit').addClass('animated fadeInUp')
$('.pro-container').addClass('animated fadeInUp')
}
// 导航二级菜单
$("li:has(ul)").hover(function() {
$(this).find("a:first").css("background-color","#eee")
$(this).find(".sub").css("display","block")
},function() {
$(this).find("a:first").css("background-color","#fff");
$(this).find(".sub").css("display","none"); 
})
//手机导航展开二级菜单
$('.menu-ul:has(ul)').click(function () {
  if ($(this).find(".sub").hasClass('active')) {
    $(this).find(".sub").css('background-color', '#3c3c3c')
    $(this).find(".sub").removeClass('active')
    $(this).find("ul").slideUp()
  } else {
    $(this).find(".sub").css('background-color', '#666')
    $(this).find(".sub").addClass('active')
    $(this).find("ul").slideToggle()
  }
})
// 产品根据分类显示
$('.pro-category li').hover(function () {
const index = $(this).index()
$(this).siblings().removeClass('active')
$('.pro-main ul').eq(index).removeClass('display_none').siblings().addClass('display_none animated pulse')
});
// 客户案例样式
$('.case-content li').hover(function () {
$(this).addClass('active').siblings().removeClass('active').find('.layer').removeClass('display_none')
$(this).siblings().find('.hover-view').addClass('display_no')
$(this).siblings().find('.default-view').removeClass('display_none')
$(this).children('.layer').addClass('display_none')
$(this).children('.hover-view').removeClass('display_no')
$(this).children('.default-view').addClass('display_none')
})