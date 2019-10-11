#!/usr/bin/env bash

export gtm_version=V6.3-004
export ydb_versionp=r1.24
export ydb_version=r124
export ydb_arch=x86_64

export ydb_path="${ydb_versionp}_${ydb_arch}"
export gtm_path="${gtm_version}_${ydb_arch}"

export ydb_retention=42
export gtm_retention=42
export LD_LIBRARY_PATH="/usr/local/lib/yottadb/${ydb_version}"
export ydb_log="/tmp/yottadb/${ydb_path}"
export gtm_log="/tmp/yottadb/${ydb_path}"
export gtm_repl_instance="/root/.yottadb/${ydb_path}/g/yottadb.repl"
export ydb_repl_instance="/root/.yottadb/${ydb_path}/g/yottadb.repl"
export ydb_gbldir="/root/.yottadb/${ydb_path}/g/yottadb.gld"
export ydb_etrap='Write:(0=$STACK) "Error occurred=",$ZStatus,!'
export ydb_dir="/root/.yottadb"
export gtmver=$gtm_path
export ydb_rel=$ydb_path
export gtmgbldir="/root/.yottadb/${ydb_path}/g/yottadb.gld"
export ydb_routines="/opt/qewd/node_modules/nodem/src /root/.yottadb/${ydb_path}/o*(/root/.yottadb/${ydb_path}/r /root/.yottadb/r) /usr/local/lib/yottadb/${ydb_version}/libyottadbutil.so"
export gtmroutines="/opt/qewd/node_modules/nodem/src /root/.yottadb/${ydb_path}/o*(/root/.yottadb/${ydb_path}/r /root/.yottadb/r) /usr/local/lib/yottadb/${ydb_version}/libyottadbutil.so"
export GTMCI="/opt/qewd/node_modules/nodem/resources/nodem.ci"
export ydb_ci="/opt/qewd/node_modules/nodem/resources/nodem.ci"
export gtmdir=/root/.fis-gtm
export gtm_etrap='Write:(0=$STACK) "Error occurred=",$ZStatus,!'
export ydb_tmp="/tmp/yottadb/${ydb_path}"
export gtm_tmp="/tmp/yottadb/${ydb_path}"
export gtm_dist="/usr/local/lib/yottadb/${ydb_version}"
export ydb_dist="/usr/local/lib/yottadb/${ydb_version}"

exec "$@"