# 3D 简历
[项目地址](https://qg14.github.io/resume/)
>Three.js,
>Vue+Element UI,
>ES6

![image](https://user-images.githubusercontent.com/100546561/155941599-442d1dd0-dae6-49ac-b6a4-ef371c3236cc.png)


## 前言
最近制作了一张3D简历。下面记录一下制作流程。

+ 草图构造
+ 下载模型
+ 制作贴图
+ 编写代码
+ 写在后面
## 草图构造
我的想法是搭建一个三维书房，房间包括两面墙，一张书桌，类似于下图：![image](https://user-images.githubusercontent.com/100546561/155942300-72e9c4cc-e960-4bc9-a85d-26191159f44c.png)

访客打开网页后，首先引入眼帘的是书桌中央的电脑显示器画面，展现的是一张粗略版的的简历。简历上有两个**了解更多**的按钮，点击后可将视角调整到书桌后面的墙上，这两面墙，一面用来展示工作经历，一面用来展示项目经验。书桌左侧放置了一些奖杯证书之类的的物件，右侧放置了乒乓球拍，单反等物件，这代表了个人爱好。
页面底部有三个导航按钮，![image](https://user-images.githubusercontent.com/100546561/155943449-a97a61c2-cbcf-419b-8c58-52b8a0e4e7fc.png)

第一个用来回到电脑显示器的视角，一个用来展示我的联系方式，一个用于下载pdf版本的简历。

## 下载模型
上文中提到的模型主要是从3D builder中下载，其次在stechfab下载，格式为gltf和glb。此外，正直冬奥会，我还放了一个冰墩墩在桌子上：）

## 制作贴图

通过Fontloader可以下载处理后的字体用在Three.js中，但文字太多会导致页面迟缓，在这里，显示器上的粗略版简历，墙上的工作经历，项目经验都是在PPT中制作好了再贴到对应的位置。

## 编写代码

按照three.js的教程一步步来，主要是实例化一个场景**scene**,然后往里面add内容，在这里，点击**了解更多**按钮后的切换效果花了些时间，比方说在切换到左边墙上时，先用鼠标拖拽，调整出一个合适的视角，然后在控制台中打印出camera的信息
![image](https://user-images.githubusercontent.com/100546561/155945373-f79c98a2-84ae-4a45-b19f-a0a05d04767a.png)

将上面的位置、旋转信息存在一个json中，在用户点击**了解更多**按钮后，首先获得camera当前位置、旋转数据，然后将两个数据的差分成20分，做一个计时器，用20次累加将当前camera移到墙上。

** 代码区块 **

    function goto_fullview(direct = "display", interval = 25) {
    let that = this,
    camera = that.camera,
    frame_rate = 20,
    camera_now = {
      position: [
        that.camera.position.x,
        that.camera.position.y,
        that.camera.position.z
      ],
      rotation: [
        that.camera.rotation._x,
        that.camera.rotation._y,
        that.camera.rotation._z
      ],
      quaternion: [
        that.camera.quaternion._w,
        that.camera.quaternion._x,
        that.camera.quaternion._y,
        that.camera.quaternion._z
      ]
    },
    camera_target = [];
    let coordinate = {
    display1: {
      position: [0.816055162473323, 34.5160207912348, 14.483266247564536],
      quaternion: [
        0.9681611829150955, -0.25032763310598183, 2.604862468272414e-18,
        6.735129106146197e-19
      ]
    },
    display: {
      position: [-0.12, 6.44, 11.15],
      rotation: [0.523, -0.009, -0.005]
    },
    certificate: {
      position: [-20.707893519108357, 35.1846189549925, 9.89421790616445],
      rotation: [-1.094958770022998, 0.016495438517374415, 0.03199698925162763]
    },
    interest: {
      position: [25.608840514053306, 40.580391036016835, 3.505514815235655],
      rotation: [
        -1.3562426762788162, 0.0034840503965316853, 0.015987263090829085
      ]
    },
    job: {
      position: [-0.286, 15.403, 26.677],
      rotation: [0.523, -0.009, -0.005]
    },
    project: {
      position: [41.561, 28.08, 21.74],
      rotation: [-0.894, 0.874, 0.703]
    }
    };
    camera_target = coordinate[direct];
    let interval_pos = Array(3)
    .fill(0)
    .map((n, index) => {
      return (
        (camera_target.position[index] - camera_now.position[index]) /
        frame_rate
      );
    });
    let interval_rot = Array(3)
    .fill(0)
    .map((n, index) => {
      return (
        (camera_target.rotation[index] - camera_now.rotation[index]) /
        frame_rate
      );
    });
    let scale = 0.8 / frame_rate;
    for (let i = 0; i < frame_rate + 1; i++) {
    setTimeout(
      function (c) {
        camera.position.set(
          ...camera_now.position.map((n, index) => {
            return n + interval_pos[index] * i;
          })
        );
        camera.rotation.set(
          ...camera_now.rotation.map((n, index) => {
            return n + interval_rot[index] * i;
          })
        );
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        c.renderer.render(c.scene, camera);
      },
      (i + 2) * interval,
      that
    );
    }}
    
  ## 写在后面
  以上代码已发布在[Github](https://github.com/qg14/qg14.github.io/tree/main/resume)文件夹下，下载下来稍微一改就可使用。这仅仅是抛砖引玉，希望可以对你有所启发，也希望大伙都可以找到适合自己的工作。
  如果对你有点帮助，就给点个**star:)**




