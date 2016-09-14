# wherearewe-express
Where Are We (NodeJS - Express -SocketIO)

#Sin base de datos
Para evitar bases de datos pero tener multicanal, realizaremos
un sistema de evento unitario, donde cada vez que haya una
actualización de coordenadas se emita ese dato a los registrados
en ese canal, de tal manera que sea el cliente quien pinte los movimientos
de cada usuario de forma unitaria.
