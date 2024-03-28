$(document).ready(function () {
    $("#nv-news").addClass("active");
    //$(".blog-slide").append('<div id="owl-demo-blog" class="owl-carousel owl-theme"><div class="item"><div class="item-inner"><div class="row"><div class="col-md-8"><div class="pro-im"><img src="/assets/marketplace/image/alogo.png"></div></div><div class="col-md-4"><div class="pro-text"><p class="fature">Featured post 1</p><h3 class="post_tittle">Post title xdhoeqhwrowe</h3><p class="date">yyyy-mm-dd</p><p class="tag"><a href="javascript:void(0)"> Tag1</a><a href="javascript:void(0)"> Tag2</a><a href="javascript:void(0)"> Tag3</a></p></div></div></div></div></div><div class="item"><div class="item-inner"><div class="row"><div class="col-md-8"><div class="pro-im"><img src="/assets/marketplace/image/alogo.png"></div></div><div class="col-md-4"><div class="pro-text"><p class="fature">Featured post 2</p><h3 class="post_tittle">Post title xdhoeqhwrowe</h3><p class="date">yyyy-mm-dd</p><p class="f2"><a href="javascript:void(0)"> Tag1</a><a href="javascript:void(0)"> Tag2</a><a href="javascript:void(0)"> Tag3</a></p></div></div></div></div></div><div class="item"><div class="item-inner"><div class="row"><div class="col-md-8"><div class="pro-im"><img src="/assets/marketplace/image/alogo.png"></div></div><div class="col-md-4"><div class="pro-text"><p class="fature">Featured post 3</p><h3 class="post_tittle">Post title xdhoeqhwrowe</h3><p class="date">yyyy-mm-dd</p><p class="f2"><a href="javascript:void(0)"> Tag1</a><a href="javascript:void(0)"> Tag2</a><a href="javascript:void(0)"> Tag3</a></p></div></div></div></div></div></div>');
    //$(".blogslist").append('<div class="row"><div class="col-md-4"><div class="blog-post-vew"><div class="hot"><span>Hot</span></div><div class="pro-im"><img src="../assets/marketplace/image/pro.png" onerror="this.src="/assets/marketplace/image/pro.png""></div><div class="pro-text"><p class="p1"><b>Post title</b></p><p class="date">YYYY-MM-DD</p><p class="tag"><a href="javascript:void(0)"> Tag1</a><a href="javascript:void(0)"> Tag2</a><a href="javascript:void(0)"> Tag3</a></p></div></div></div><div class="col-md-4"><div class="blog-post-vew"><div class="hot"><span>Hot</span></div><div class="pro-im"><img src="../assets/marketplace/image/pro.png" onerror="this.src="/assets/marketplace/image/pro.png""></div><div class="pro-text"><p class="p1"><b>Post title</b></p><p class="p2">Restaurant 1 <span class="clr-tag">3a<span></span></span></p><p class="tag"><a href="javascript:void(0)"> Tag1</a><a href="javascript:void(0)"> Tag2</a><a href="javascript:void(0)"> Tag3</a></p></div></div></div><div class="col-md-4"><div class="blog-post-vew"><div class="hot"><span>Hot</span></div><div class="pro-im"><img src="../assets/marketplace/image/pro.png" onerror="this.src="/assets/marketplace/image/pro.png""></div><div class="pro-text"><p class="p1"><b>Rohan Technology</b></p><p class="p2">Restaurant 1 <span class="clr-tag">3a<span></span></span></p><p class="tag"><a href="javascript:void(0)"> Tag1</a><a href="javascript:void(0)"> Tag2</a><a href="javascript:void(0)"> Tag3</a></p></div></div></div></div>');

    //$(".pagination").append('<button class="btn" onclick="setNewsData(1)"><img src="../assets/marketplace/image/p1.png" /></button>');
    //$(".pagination").append('<button class="btn" id="next-page-nav" onclick="setNewsData(${(pageNumber <= 1) ? 1 : (pageNumber - 1)})"><img src="../assets/marketplace/image/p12.png" /></button>');


    getFeaturedbolgs();
});



function getFeaturedbolgs() {
    $.ajax({
        url: '/Marketplace/GetFeaturedBlogs',
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            var FeaturedBlogs = response.Data;
            console.log(FeaturedBlogs, "FeaturedBlogsresponse");            
            var featuredBloghtml = '<div id="owl-demo-blog" class="owl-carousel owl-theme">';
            for (let i = 0; i < FeaturedBlogs.length; i++) {
                featuredBloghtml += '<div class="item">';
                featuredBloghtml += '    <div class="item-inner">';
                featuredBloghtml += '        <div class="row">';
                featuredBloghtml += '            <div class="col-md-8">';
                featuredBloghtml += '                <div class="pro-im">';
                featuredBloghtml += '                    <img src="/assets/marketplace/image/alogo.png">';
                featuredBloghtml += '                            </div>';
                featuredBloghtml += '                </div>';
                featuredBloghtml += '                <div class="col-md-4">';
                featuredBloghtml += '                    <div class="pro-text">';
                featuredBloghtml += '                        <p class="fature">Featured post 1</p>';
                featuredBloghtml += '                        <h3 class="post_tittle">Post title xdhoeqhwrowe</h3>';
                featuredBloghtml += '                        <p class="date">yyyy-mm-dd</p>';
                featuredBloghtml += '                        <p class="tag">';
                featuredBloghtml += '                            <a href="javascript:void(0)"> Tag1</a>';
                featuredBloghtml += '                            <a href="javascript:void(0)"> Tag2</a>';
                featuredBloghtml += '                            <a href="javascript:void(0)"> Tag3</a>';
                featuredBloghtml += '                        </p>';
                featuredBloghtml += '                    </div>';
                featuredBloghtml += '                </div>';
                featuredBloghtml += '            </div>';
                featuredBloghtml += '        </div>';
                featuredBloghtml += '    </div>';
            }
             featuredBloghtml += '</div>';
            //console.log(featuredBloghtml,"featuredBloghtml");

            $(".blog-slide").append(featuredBloghtml);

        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}