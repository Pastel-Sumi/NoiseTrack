import React, { useState } from 'react';
import { Table, Loader } from "semantic-ui-react";
import { map, size } from "lodash";

export function UserList(props) {
    const { workers } = props

    if(size(workers) === 0){
        return (
            <div>
                <h2>Lista de usuarios registrados</h2> 
            
                <Loader active inline="centered" size="large">
                    Cargando lista de trabajadores
                </Loader>
            </div>
        )
    }

    console.log("workers", workers)

    return (
        <div>
        <h2>Lista de usuarios registrados</h2> 

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
        </div>
  )
}
