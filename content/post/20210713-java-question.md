---
title: "Java Day23习题的解答"
date: 2021-07-13T20:00:53+08:00
draft: false
summary: "这是我对于那两道题的解答，仅供参考"
katex: true
mermaid: true
comments: true
tags: ["Java"]
categories: ["Miscellany", "Coding"]
dropCap: false
indent: false
---

难得有心情，就摸一篇博客吧

这两道题是老杜的Java教程第23天的课后习题，感觉还是蛮经典的，就发一下我自己的解答，仅供参考

## 模拟栈结构

这个模拟栈结构，要求可以弹栈`pop()`，压栈`push()`，还要有栈帧`stack_frame`等结构，要求能够存入所有引用数据类型，最后还需要做个测试

这里我就使用`Object`数组来实现这个结构，作为内部数据存储的结构，下面是我的代码，有足够的注释了，相信还是很好看懂的

```java
package top.qarks.Arrays;

public class ArrayTest03 {
    public static void main(String[] args) {
        // 实例化栈
        Stack stk = new Stack(10);
        System.out.println(stk);
        // 模拟压栈
        for (int i = 0; i < stk.getElements().length; ++i) {
            stk.push(new Object());
        }
        // 模拟栈满后自动扩栈
        if (stk.push(8)) {
            System.out.println("Push sucecceed");
        } else {
            System.out.println("Failed");
        }
        // 检测扩栈是否成功
        System.out.println(stk);
        // 模拟弹栈
        for (int i = stk.getStack_frame(); i >= 0; --i) {
            System.out.println(stk.pop());
        }
        // 测试栈空后弹栈
        stk.pop();
    }
}

class Stack {
    // 默认栈帧指向栈顶
    private int stack_frame = -1;
    private Object[] elements;

    // 初始化栈
    public Stack(int num) {
        this.elements = new Object[num];
    }

    public Object[] getElements() {
        return this.elements;
    }

    public int getStack_frame() {
        return this.stack_frame;
    }

    // 压栈
    public boolean push(Object obj) {
        if (stack_frame + 1 < this.elements.length) {
            this.elements[++stack_frame] = obj;
            return true;
        }
        System.out.println("The Stack is full!");
        System.out.println("Try to automatically expand the Stack...");
        Object[] bigger_elem = new Object[this.elements.length * 2];
        System.arraycopy(this.elements, 0, bigger_elem, 0, elements.length);
        this.elements = bigger_elem;
        System.out.println("Successfully expanded!");
        return false;
    }

    // 弹栈
    public Object pop() {
        if (stack_frame < 0) {
            System.out.println("The Stack is empty!");
            return null;
        }
        return this.elements[stack_frame--];
    }

    @Override
    public String toString() {
        return String.format("栈编号: %d, 栈空间: %d, 栈内元素: %d", this.hashCode(), elements.length, this.stack_frame + 1);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (null == obj || !(obj instanceof Stack))
            return false;
        return compare(this, (Stack) obj);
    }

    private boolean compare(Stack s1, Stack s2) {
        if (s1.elements.length != s2.elements.length)
            return false;
        for (int i = 0; i < s1.elements.length; ++i) {
            if (!s1.elements[i].equals(s2.elements[i]))
                return false;
        }
        return true;
    }
}
```

要求基本上都满足了，而且还能够自动扩容，再也不怕爆栈了（滑稽

## 模拟酒店系统

这个要求就比较多了

题目如下:

为某酒店编写程序：酒店管理系统，模拟订房，退房，打印所有房间状态等功能

- 房间应有功能：房间编号，房间类型，房间是否空闲
- 系统应有功能：
    1. 预订房间：输入房间编号订房
    2. 退房：输入房间编号退房
    3. 查看房间状态：输入相应信息查询房间状态

我的题解和思路如下

```java
package top.qarks.Arrays;

import java.util.Random;
import java.util.Scanner;

public class ArrayTest04 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("请输入酒店规模");
        System.out.print("层数: ");
        int floors = sc.nextInt();
        System.out.print("每层房间数: ");
        int rooms_per_floor = sc.nextInt();

        HotelManagementSystem hms = new HotelManagementSystem(floors, rooms_per_floor);
        hms.dashBoard();

        System.out.println("\n程序结束！");
        sc.close();
    }
}

class HotelManagementSystem {
    // 楼层数
    private int floors;
    // 每层房间数
    private int rooms_per_floor;
    // 所有房间
    private Room[][] rooms;
    // 空闲房间数
    private int free_rooms;
    // 门牌号基数
    private int base;

    private static Scanner sc = new Scanner(System.in);

    // 构造方法
    public HotelManagementSystem(int floors, int rooms_per_floor) {
        this.floors = floors;
        this.rooms_per_floor = rooms_per_floor;
        free_rooms = floors * rooms_per_floor;
        base = (int) Math.floor(Math.log10(rooms_per_floor)) >= 2
                ? ((int) Math.floor(Math.log10(rooms_per_floor)) == 2 ? 1000
                        : (int) Math.pow(10, (int) Math.floor(Math.log10(rooms_per_floor))))
                : 100;
        initRooms(floors, rooms_per_floor);
    }

    // 初始化房间
    private void initRooms(int floors, int rooms_per_floor) {
        rooms = new Room[floors][rooms_per_floor];
        // 算出门牌号的写法
        for (int i = 0; i < floors; ++i) {
            for (int j = 0; j < rooms_per_floor; ++j) {
                String type;
                switch (new Random().nextInt(3)) {
                    case 0:
                        type = "普通";
                        break;
                    case 1:
                        type = "高级";
                        break;
                    case 2:
                        type = "贵宾";
                        break;
                    default:
                        type = "未知"; // 不可能到这 :)
                }
                rooms[i][j] = new Room(base * (i + 1) + (j + 1), type);
            }
        }
    }

    // 面板
    public void dashBoard() {
        Sys: while (true) {
            System.out.println("\n\n==========酒店后台管理系统=========");
            System.out.println(" 1. 客户订房");
            System.out.println(" 2. 客户退房");
            System.out.println(" 3. 房间信息查询");
            System.out.println("                0. 退出系统");
            System.out.println("请输入选项");
            switch (sc.nextInt()) {
                case 1:
                    System.out.print("请输入要预订的房间号: ");
                    if (!roomReservation(sc.nextInt())) {
                        System.out.println("订房操作失败");
                    }
                    break;
                case 2:
                    System.out.print("请输入要退订的房间号: ");
                    if (!checkOut(sc.nextInt())) {
                        System.out.println("退房操作失败");
                    }
                    break;
                case 3:
                    printRoomsInfo();
                    break;
                case 0:
                    break Sys;
                default:
                    System.out.println("选项错误，请重新输入\n");
            }
        }
        System.out.println("欢迎下次使用，再见！");
    }

    // 订房
    private boolean roomReservation(int room_number) {
        int tfloor = room_number / base;
        int troom = room_number % base;
        if (tfloor > this.floors || troom > this.rooms_per_floor || tfloor <= 0 || troom <= 0) {
            System.out.println("该房间号不存在");
            return false;
        }
        if (rooms[tfloor - 1][troom - 1].isIs_free()) {
            System.out.println(room_number + "号房订房成功");
            rooms[tfloor - 1][troom - 1].setIs_free(false);
            --free_rooms;
            return true;
        } else {
            System.out.println("该房间已有客户，订房失败");
            return false;
        }
    }

    // 退房
    private boolean checkOut(int room_number) {
        int tfloor = room_number / base;
        int troom = room_number % base;
        if (tfloor > this.floors || troom > this.rooms_per_floor || tfloor <= 0 || troom <= 0) {
            System.out.println("该房间号不存在");
            return false;
        }
        if (rooms[tfloor - 1][troom - 1].isIs_free()) {
            System.out.println("该房间未有客户入住，退房失败");
            return false;
        } else {
            rooms[tfloor - 1][troom - 1].setIs_free(true);
            System.out.println(room_number + "退房成功");
            ++free_rooms;
            return true;
        }
    }

    // 查看房间状态
    private void printRoomsInfo() {
        Pro: while (true) {
            System.out.println("\n\n==========房间信息查询系统=========");
            System.out.println(" 1. 查询某一房间的信息");
            System.out.println(" 2. 查询某一层住房信息");
            System.out.println(" 3. 查询所有房间信息");
            System.out.print("\n请输入选项: ");
            switch (sc.nextInt()) {
                case 1:
                    while (true) {
                        System.out.print("请输入房间号: ");
                        int room_number = sc.nextInt();
                        int tfloor = room_number / base;
                        int troom = room_number % base;

                        if (tfloor > floors || troom > rooms_per_floor || tfloor <= 0 || troom <= 0) {
                            System.out.println("该房间号不存在");
                            System.out.println("请重新输入\n");
                            continue;
                        }
                        System.out.println(rooms[tfloor - 1][troom - 1]);
                        break Pro;
                    }
                case 2:
                    while (true) {
                        System.out.print("请输入要查询的层号: ");
                        int tfloor = sc.nextInt();
                        if (tfloor > floors | tfloor <= 0) {
                            System.out.println("该层数不存在");
                            System.out.println("请重新输入\n");
                            continue;
                        }
                        for (int i = 0; i < rooms_per_floor; ++i) {
                            System.out.println(rooms[tfloor - 1][i]);
                        }
                        break Pro;
                    }
                case 3:
                    System.out.println("目前空闲房间数" + free_rooms);
                    for (int i = 0; i < floors; ++i) {
                        for (int j = 0; j < rooms_per_floor; ++j) {
                            System.out.println(rooms[i][j]);
                        }
                    }
                    break Pro;
                default:
                    System.out.println("选项错误，请重新输入\n");
            }
        }
    }
}

class Room {
    // 房间编号
    private int room_number;
    // 住房类型
    private String room_type;
    // 住房状态，默认空闲
    private boolean is_free = true;

    // 构造函数
    public Room(int room_number, String room_type) {
        this.room_number = room_number;
        this.room_type = room_type;
    }

    // 提供set方法改变状态
    public void setIs_free(boolean is_free) {
        this.is_free = is_free;
    }

    // 提供get方法查看信息
    public String getRoom_type() {
        return room_type;
    }

    public boolean isIs_free() {
        return is_free;
    }

    // 重写toString方法优化输出
    @Override
    public String toString() {
        return String.format("房间号: %d (%s) [%s]", this.room_number, this.room_type, this.is_free ? "空闲" : "占用");
    }
}
```

还是比较繁琐的

---

如果有什么错误或者修改建议可在评论指出，谢谢大家的阅读