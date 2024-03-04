# Rust 学习 实例 02

<p class="archive-time">archive time: 2022-10-30</p>

<p class="sp-comment">这是杨旭大佬视频里最后的那个例子，一个简单的 Web 服务器</p>

[[toc]]

## 需求

看看这个项目需求

- 在 socket 上监听 TCP 连接
- 解析少量 HTTP 请求
- 创建一个合适的 HTTP 响应
- 使用线程池改进服务器的吞吐量

可见还是很全面的

## 单线程实现

首先看看单线程的实现

```rust
use std::{
    fs,
    io::{Read, Write},
    net::{TcpListener, TcpStream},
};

fn main() {
    const PORT: usize = 7878;
    let listener = TcpListener::bind(format!("127.0.0.1:{}", PORT)).unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 512];
    stream.read(&mut buffer).unwrap();
    let get = b"GET / HTTP/1.1\r\n";

    let (status, page_path) = if buffer.starts_with(get) {
        ("HTTP/1.1 200 OK\r\n\r\n", "simple_server/web/index.html")
    } else {
        (
            "HTTP/1.1 404 NOT FOUND\r\n\r\n",
            "simple_server/web/404.html",
        )
    };
    stream
        .write(format!("{}{}", status, fs::read_to_string(page_path).unwrap(),).as_bytes())
        .unwrap();
    stream.flush().unwrap();
}
```

这里，我们使用 `std::net::TcpListener` 的 `bind()` 方法绑定 `7878`[^1] 端口

`TcpListener` 会监听这个端口所有的 TCP 消息，这里使用 for 循环将消息以 `stream` 读取，交给 `handle_connection` 处理消息

在 `handle_connection` 里，使用 `std::io::Read` 的 `read()` 方法将 `stream` 数据读取到 `buffer` 里

注意到，这里消息由 `u8` 格式传递，如需要读取消息内容，需要使用 `String::from_utf8_lossy()` 方法进行传递

而后我们判断请求是否是获取根目录 `/` 的页面，如果是，则返回我们准备好的 `index.html` 页面，其他消息则返回 `404.html` 页面

返回需要使用 `stream` 里的 `write()` 方法写入，最后使用 `flush()` 刷新，确保消息传递完毕

## 多线程实现

如果要改为多线程，则需要使用到线程池技术，这里，我们来实现一下线程池

```rust
use std::{
    sync::{mpsc, Arc, Mutex},
    thread,
};

type Job = Box<dyn FnBox + Send + 'static>;

enum Message {
    NewJob(Job),
    Terminate,
}

pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<Message>,
}

impl ThreadPool {
    pub fn new(size: usize) -> ThreadPool {
        let mut workers = Vec::with_capacity(size);
        let (sender, reciver) = mpsc::channel();
        let reciver = Arc::new(Mutex::new(reciver));

        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&reciver)));
        }

        ThreadPool { workers, sender }
    }

    pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.sender.send(Message::NewJob(job)).unwrap();
    }
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        for _ in &mut self.workers {
            self.sender.send(Message::Terminate).unwrap();
        }

        for worker in &mut self.workers {
            println!("shuutting down worker {}", worker.id);

            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap();
            }
        }
    }
}

pub struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

trait FnBox {
    fn call_box(self: Box<Self>);
}

impl<F: FnOnce()> FnBox for F {
    fn call_box(self: Box<Self>) {
        (*self)()
    }
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Message>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv().unwrap();
            match message {
                Message::NewJob(job) => {
                    println!("Worker {} got a job, executing!", id);
                    job.call_box();
                }
                Message::Terminate => {
                    println!("Worker {} was told to terminate", id);
                    break;
                }
            }
        });

        Worker {
            id,
            thread: Some(thread),
        }
    }
}
```

首先，线程池自然需要存储线程，这里，我们使用 `Vec<Worker>` 来存储线程，这里的 `Worker` 类型就是我们用来帮助我们处理线程的类型

而 `sender` 是用于分发任务，这里的 "任务" 我们使用 `Job` 类型来表示

```rust
type Job = Box<dyn FnBox + Send + 'static>;
```

至于 Worker 和 Job 这些则是线程池常用术语，可以参考 [这里](https://en.wikipedia.org/wiki/Thread_pool)

在 Rust 里，`mpsc` 是多个生产者，一个消费者，对应这里就是一个接收端，多个发送端

每个 Worker 都需要接收到消息，但同一时间只能有一个 Worker 能收到消息，所以我们使用 `Arc` 和 `Mutex` 来分发接收端

```rust
pub fn new(size: usize) -> ThreadPool {
    let mut workers = Vec::with_capacity(size);
    let (sender, reciver) = mpsc::channel();
    let reciver = Arc::new(Mutex::new(reciver));

    for id in 0..size {
        workers.push(Worker::new(id, Arc::clone(&reciver)));
    }

    ThreadPool { workers, sender }
}
```

我们在 Worker 中传递的消息可以分为两种，工作和终止，这里我们使用 `Message` 来包裹

Worker 使用 `thread::spawn()` 来生成线程，需要执行的代码就是不断等待

如果拿到了接收端，收到了消息，则执行任务，如果收到了终止信号 `Message::Terminate`，则 `break` 终止

```rust
fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Message>>>) -> Worker {
    let thread = thread::spawn(move || loop {
        let message = receiver.lock().unwrap().recv().unwrap();
        match message {
            Message::NewJob(job) => {
                println!("Worker {} got a job, executing!", id);
                job.call_box();
            }
            Message::Terminate => {
                println!("Worker {} was told to terminate", id);
                break;
            }
        }
    });

    Worker {
        id,
        thread: Some(thread),
    }
}
```

之后，我们需要处理结束，即需要实现 `Drop` 这个特性

```rust
fn drop(&mut self) {
    for _ in &mut self.workers {
        self.sender.send(Message::Terminate).unwrap();
    }

    for worker in &mut self.workers {
        println!("shuutting down worker {}", worker.id);

        if let Some(thread) = worker.thread.take() {
            thread.join().unwrap();
        }
    }
}
```

首先向每个 Worker 发送一个终止信号，然后使用 `worker.thread.take()` 将线程取出，使用 `join()` 方法等待线程结束

然后我们的主函数也要修改

```rust
use std::{
    fs,
    io::{Read, Write},
    net::{TcpListener, TcpStream},
    thread,
    time::Duration,
};

use simple_server::ThreadPool;

fn main() {
    const PORT: usize = 7878;
    let listener = TcpListener::bind(format!("127.0.0.1:{}", PORT)).unwrap();
    let pool = ThreadPool::new(4);

    for stream in listener.incoming().take(2) {
        let stream = stream.unwrap();

        pool.execute(|| {
            handle_connection(stream);
        })
    }

    println!("end!");
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 512];
    stream.read(&mut buffer).unwrap();
    let root = b"GET / HTTP/1.1\r\n";
    let sleep = b"GET /sleep HTTP/1.1\r\n";

    let (status, page_path) = if buffer.starts_with(root) {
        ("HTTP/1.1 200 OK\r\n\r\n", "simple_server/web/index.html")
    } else if buffer.starts_with(sleep) {
        thread::sleep(Duration::from_secs(10));
        ("HTTP/1.1 200 OK\r\n\r\n", "simple_server/web/index.html")
    } else {
        (
            "HTTP/1.1 404 NOT FOUND\r\n\r\n",
            "simple_server/web/404.html",
        )
    };
    stream
        .write(format!("{}{}", status, fs::read_to_string(page_path).unwrap(),).as_bytes())
        .unwrap();
    stream.flush().unwrap();
}
```

使用 `let pool = ThreadPool::new(4);` 生成一个 `4` 线程的线程池

而后在循环中使用 `pool.execute()` 来将任务放进线程池

好，至此，这个十分简陋的服务器就算是完成了

---

到这里，Rust 的基础学习就算结束了，可以好好准备考试了

[^1]: 端口选择随意，这里只是选了一个不常用的端口
