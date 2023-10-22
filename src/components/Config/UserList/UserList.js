import React from 'react';
import { Table } from "semantic-ui-react";
import { map, size } from "lodash";

import "./UserList.scss";

export function UserList(props) {
    const { workers } = props

    return (
        <div className='userList-container'>
        <h2>Lista de trabajadores ingresados</h2> 

        {
            size(workers) === 0 ? (
                <h3 className='info-workers'>No se han ingresado trabajadores</h3>
            ) : (
                <Table>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>Nombre</Table.HeaderCell>
                        <Table.HeaderCell>Correo electrónico</Table.HeaderCell>
                        <Table.HeaderCell>Lugar de trabajo</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {map(workers, (worker) => (
                        <Table.Row key={worker}>
                            <Table.Cell>{worker.username}</Table.Cell>
                            <Table.Cell>{worker.email}</Table.Cell>
                            <Table.Cell>{worker.place}</Table.Cell>
                        </Table.Row>

                        ))}
                    </Table.Body>
                </Table>
            )
        }
        </div>
  )
}
