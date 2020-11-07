# Pandas + SqlAlchemy的连接问题
## 说明
### 前置知识
`pd.read_sql`的参数con可以是engine（由create_engine声明），也可以是connection（由engine.connect()声明）

### 使用Engine情况下
1. 由alchemy的`create_engine`创建的engine，在`pd.read_sql`后将自动关闭连接，但是会保留连接池（方便下次调用）；
2. 可以在`create_engine`时加入参数`poolclass=NullPool`，这样不会创建连接池；
3. 可以调用`engine.dispose()`方法关闭engine；

### 使用Connection情况下
1. `connection = engine.connect()`后可以用`connection.close()`关闭连接；
2. 这种情况下关闭engine仍然需要使用`engine.dispose()`;

## 测试
```
engine = create_engine('...')
# Context manager makes sure the `Connection` is closed safely and implicitly
with engine.connect() as conn:
    df = pd.read_sql_query(query, conn)
    print(conn.in_transaction()) # False
    # do_something_with(conn)
    trans = conn.begin()
    print(conn.in_transaction()) # True
    # do_whatever_with(trans)
    print(conn.closed) # False
print('Is Connection with-OUT closed?', conn.closed) # True
engine.dispose()
```
